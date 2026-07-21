<template>

<div class="app-logo">
    <div class="logo-square">
        <div class="logo-inner"></div>
    </div>
    <div class="brand-text">
        <h2>BE-VAULT</h2>
        <span>v1.0.0-SECURE</span>
    </div>
</div>

</template>

<style scoped>

.app-logo {
    display: flex;
    align-items: center;
    gap: 15px;
}

.logo-square {
    width: 40px; /* h-10 w-10 */
    height: 40px;
    border: 1px solid var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-inner {
    width: 16px; /* h-4 w-4 */
    height: 16px;
    background-color: var(--text-primary);
    transition: transform 0.5s;
}

.logo-square:hover .logo-inner {
    transform: rotate(45deg);
}

.brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
}

.brand-text h2 {
    font-size: 0.875rem; /* text-sm */
    letter-spacing: 0.3em; /* caps-title */
    font-weight: 300;
    text-transform: uppercase;
    margin: 0;
    color: var(--text-primary);
}

.brand-text span { 
    margin-top: 0.375rem; /* mt-1.5 */
    font-size: 10px; /* text-[10px] */
    color: oklch(0.704 0.04 256.788 / 0.6); /* text-muted-foreground/60 */
    font-family: var(--font-mono);
}

</style>