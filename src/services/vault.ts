import { supabase } from './supabase'
import { encryptData, decryptData } from '../utils/crypto'
import { activeCryptoKey } from '../stores/keyStore'

interface EncryptedVaultRow {
    id_vault: string;
    service_name: string;
    username: string;
    encrypted_data: string;
    created_at: string;
}

export async function fetchAndDecryptVaultItems() {
    if(!activeCryptoKey.value) throw new Error("Chave não encontrada. Cofre trancado.");

    const { data, error } = await supabase
        .from('vault_items')
        .select('*')
        .order('created_at', { ascending: false});
    
    if (error) throw error;
    if(!data) return [];

    const decryptedItems = [];

    for (const row of data as unknown as EncryptedVaultRow[]) {
        try {
            const decryptedPassword = await decryptData(row.encrypted_data, activeCryptoKey.value);
            
            decryptedItems.push({
                id_vault: row.id_vault,
                service_name: row.service_name,
                username: row.username,
                password: decryptedPassword,
                created_at: row.created_at
            });
        } catch (err) {
            console.error("Falha ao descriptografar:", row.service_name, err);
        }
    }
    return decryptedItems;
}

export async function addEncryptedVaultItem(service_name: string, username: string, plainPassword: string) {
    if (!activeCryptoKey.value) throw new Error("Cofre trancado.");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado.");

    // 1. Criptografa a senha pura
    const encryptedData = await encryptData(plainPassword, activeCryptoKey.value);
    // 2. Salva no banco (Supabase NUNCA vai saber qual é a plainPassword)
    const { data, error } = await supabase
        .from('vault_items')
        .insert({
            user_id: user.id,
            service_name,
            username,
            encrypted_data: encryptedData
        })
        .select()
        .single();

    if (error) throw error;
    
    // Retorna o item já descriptografado para injetarmos na Store imediatamente
    return {
        id_vault: data.id_vault,
        service_name: data.service_name,
        username: data.username,
        password: plainPassword,
        created_at: data.created_at
    };
}

export async function deleteVaultItem(id: string) {
    const { error } = await supabase
        .from('vault_items')
        .delete()
        .eq('id_vault', id);

    if (error) throw error;
}

export async function updateEncryptedVaultItem(id: string, service_name: string, username: string, plainPassword?: string) {
    if (!activeCryptoKey.value) throw new Error("Cofre trancado.");
    const updateData: any = { service_name, username };
    
    // Só criptografa a senha de novo se o usuário tiver digitado uma senha nova
    if (plainPassword) {
        updateData.encrypted_data = await encryptData(plainPassword, activeCryptoKey.value);
    }

    const { error } = await supabase
        .from('vault_items')
        .update(updateData)
        .eq('id_vault', id);
    if (error) throw error;

}