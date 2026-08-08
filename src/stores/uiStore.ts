import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning'

export const useUiStore = defineStore('ui', () => {
    const toastMessage = ref('')
    const toastType = ref<ToastType>('success')
    const isToastVisible = ref(false)

    let timeoutId: number | null = null

    function showToast(message: string, type: ToastType = 'success') {
        toastMessage.value = message
        toastType.value = type
        isToastVisible.value = true

        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        timeoutId = window.setTimeout(() => {
            isToastVisible.value = false
        }, 3000)
    }

    return { toastMessage, toastType, isToastVisible, showToast }
})
