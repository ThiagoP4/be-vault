<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLogo from '../components/AppLogo.vue'

const route = useRoute()
const router = useRouter()

const typed = ref("");
const fullCmd = `vault -locate ${route.path}/not-found`
const errorMsg = ref("");
const hintMsg = ref("");
const fullError = "✗ decryption failed — record 0x404 not in ledger"
const fullHint = "hint: verify the URL or return to your primary vault."

const canvasRef = ref<HTMLCanvasElement | null>(null)

const scrambled = ref<string[]>(["4", "0", "4"])
const locked = ref<boolean[]>([false, false, false])

onMounted(() => {
  let i = 0;
  let intervalId: number;
  let timeoutId: number;

  intervalId = window.setInterval(() => {
    i++;
    typed.value = fullCmd.slice(0, i);
    
    if (i >= fullCmd.length) {
      window.clearInterval(intervalId);
      
      timeoutId = window.setTimeout(() => {
        let j = 0;
        intervalId = window.setInterval(() => {
          j++;
          errorMsg.value = fullError.slice(0, j);
          
          if (j >= fullError.length) {
            window.clearInterval(intervalId);
            
            timeoutId = window.setTimeout(() => {
              let k = 0;
              intervalId = window.setInterval(() => {
                k++;
                hintMsg.value = fullHint.slice(0, k);
                if (k >= fullHint.length) {
                  window.clearInterval(intervalId);
                }
              }, 20);
            }, 200);
          }
        }, 20);
      }, 400);
    }
  }, 55);

  onUnmounted(() => {
    window.clearInterval(intervalId);
    window.clearTimeout(timeoutId);
  });
})

onMounted(() => {
  const target = ["4", "0", "4"]
  const chars = "0123456789ABCDEF"
  const lockAt = [900, 1600, 2300]
  const start = performance.now()
  let raf = 0

  const tick = (now: number) => {
    const elapsed = now - start

    const nextScram = target.map((t, i) =>
      elapsed > lockAt[i] ? t : chars[Math.floor(Math.random() * chars.length)]
    )
    const nextLocked = lockAt.map((t) => elapsed > t)

    scrambled.value = nextScram
    locked.value = nextLocked

    if (elapsed < lockAt[2] + 200) {
      raf = requestAnimationFrame(tick)
    }
  }
  raf = requestAnimationFrame(tick)
  onUnmounted(() => cancelAnimationFrame(raf))
})

onMounted(() => {
  const canvas = canvasRef.value
  if(!canvas) return

  const ctx = canvas.getContext("2d")
  if(!ctx) return

  let raf = 0
  let width = 0
  let height = 0
  const dpr = Math.min(window.devicePixelRatio  || 1, 2)

  const resize = () => {
    width = canvas.clientWidth
    height = canvas.clientHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
  }

  resize()

  const onResize = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    resize()
  }
  window.addEventListener("resize", onResize)

  const chars = "01ABCDEF·×⌘◇◆□■▲△"
  const fontSize = 14
  let columns = Math.floor(width / fontSize)
  let drops: number[] = Array(columns).fill(0).map(() => Math.random() * -50)

  const draw = () => {
    ctx.fillStyle = "rgba(5, 9, 20, 0.08)"
    ctx.fillRect(0, 0, width, height)
    
    ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`

    for(let i = 0; i < columns; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)]
      const x = i * fontSize
      const y = drops[i] * fontSize
      
      // Cores "Matrix" - Você pode ajustar os RGBA se quiser
      ctx.fillStyle = Math.random() > 0.985 ? "rgba(120, 220, 200, 0.9)" : "rgba(90, 140, 160, 0.18)"
      ctx.fillText(ch, x, y)
      
      if (y > height && Math.random() > 0.975) drops[i] = 0
      drops[i] += 0.35
    }
    raf = requestAnimationFrame(draw)
  }
  draw()

  onUnmounted(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener("resize", onResize)
  })
})
</script>

<template>
  <div class="not-found-wrapper">
    <canvas class="matrix-canvas" ref="canvasRef"></canvas>
    <div class="vignette-overlay"></div>
    <div class="scanlines-overlay"></div>

    <!-- Top bar com classe global -->
    <header class="app-top-header">
      <AppLogo />
      <div class="status-indicator">
        <span class="dot" style="background-color: var(--destructive); box-shadow: 0 0 6px var(--destructive);"></span>
        CHANNEL BROKEN
      </div>
    </header>

    <main class="main-content">
      <div class="vault-dial">
        <svg class="ring-outer" viewBox="0 0 200 200" fill="none">
         <circle cx="100" cy="100" r="96" stroke="rgba(148,163,184,0.25)" stroke-width="0.5" stroke-dasharray="1 3" />
          <circle cx="100" cy="100" r="88" stroke="rgba(148,163,184,0.15)" stroke-width="0.3" stroke-dasharray="0.5 2" />
        </svg>
        <svg class="ring-inner" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="rgba(120,220,200,0.35)" stroke-width="0.4" stroke-dasharray="8 6 2 6" />
          <line
            v-for="i in 60"
            :key="i"
            x1="100"
            y1="22"
            x2="100"
            :y2="(i - 1) % 5 === 0 ? '16' : '20'"
            stroke="rgba(148,163,184,0.35)"
            :stroke-width="(i - 1) % 5 === 0 ? '0.6' : '0.3'"
            :transform="`rotate(${(i - 1) * 6} 100 100)`"
          />
        </svg>
        <span class="center-pulse" />
        <div class="center-digits">
          <span
           v-for="(d,i) in scrambled"
           :key="i"
           :class="['digit', locked[i] ? 'digit-locked' : 'digit-scrambling']"
          >{{ d }}</span>
        </div>
        <div class="status-pill pill-top">
          {{ locked[2] ? "◇ ENTRY NOT FOUND" : "◇ SCANNING LEDGER" }}
        </div>
        <div class="status-pill pill-bottom">
          0x404 · DECRYPT FAILED
        </div>
      </div>
      <div class="text-content">
        <p class="error-title">THIS RECORD IS ENCRYPTED OR DOES NOT EXIST</p>
        <p class="error-desc">
          The path you requested could not be decrypted with the current master key.
          Zero-knowledge means we cannot help you find what is not here.
        </p>
      </div>

      <!-- Terminal -->
      <div class="terminal">
        <div class="terminal-header">
          <span class="term-dot dot-red" />
          <span class="term-dot dot-yellow" />
          <span class="term-dot dot-green" />
          <span class="term-title">~/be-vault/session</span>
        </div>
        <div class="terminal-body">
          <div>
            <span class="term-user">user@vault</span>
            <span class="term-colon">:~$ </span>
            <span>{{ typed }}</span>
            <span class="term-cursor" />
          </div>
          <template v-if="errorMsg">
            <div class="term-error">{{ errorMsg }}</div>
            <div class="term-hint" v-if="hintMsg">{{ hintMsg }}</div>
          </template>
        </div>
      </div>

      <!-- Actions -->
      <div class="action-buttons">
        <router-link to="/" class="btn-return">
          <span>← RETURN TO VAULT</span>
        </router-link>
        <button @click="router.back()" class="btn-back">
          GO BACK
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bottom-bar">
      <div>AES-256-GCM · PBKDF2</div>
      <div>ERROR · 0x00000194</div>
      <div>ZERO-KNOWLEDGE</div>
    </footer>
  </div>
</template>

<style scoped>
.not-found-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: var(--bg-app);
  color: var(--text-primary);
  font-family: var(--font-mono); 
}

.matrix-canvas {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  opacity: 0.6;
}

.main-content {
  position: relative;
  z-index: 10;
  margin: 0 auto;
  display: flex;
  min-height: calc(100vh - 9rem);
  max-width: 72rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  text-align: center;
}

.vault-dial {
  position: relative;
  display: flex;
  height: 340px;
  width: 340px;
  align-items: center;
  justify-content: center;
  user-select: none;
}

@media (min-width: 768px) {
  .vault-dial { height: 420px; width: 420px; }
}

.ring-outer {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  animation: spin 28s linear infinite;
}
.ring-inner {
  position: absolute;
  inset: 1rem;
  height: calc(100% - 2rem);
  width: calc(100% - 2rem);
  animation: spin-reverse 18s linear infinite;
}
.center-pulse {
  position: absolute;
  height: 14rem;
  width: 14rem;
  border-radius: 50%;
  border: 1px solid var(--destructive);
  opacity: 0.2;
  animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}
.center-digits {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.digit {
  display: inline-block;
  width: 0.72em;
  text-align: center;
  font-weight: bold;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s;
  font-size: clamp(6rem, 18vw, 10rem);
}
.digit-locked {
  color: var(--text-primary);
  text-shadow: 0 0 40px rgba(120,220,200,0.25);
}
.digit-scrambling {
  color: rgba(110, 231, 183, 0.8);
  text-shadow: 0 0 25px rgba(120,220,200,0.6);
}

.status-pill {
  position: absolute;
  border-radius: 2px;
  border: 1px solid var(--border);
  background-color: var(--bg-app);
  padding: 0.25rem 0.75rem;
  font-size: 9px;
  letter-spacing: 0.4em;
}
.pill-top { top: -0.75rem; color: var(--text-muted); }
.pill-bottom { bottom: -0.75rem; color: var(--destructive); opacity: 0.8; }
.text-content {
  margin-top: 2.5rem;
  max-width: 36rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.error-title {
  font-size: 0.875rem;
  letter-spacing: 0.25em;
  color: var(--text-muted);
}
.error-desc {
  font-size: 0.75rem;
  line-height: 1.625;
  color: var(--text-muted);
}
/* ========================
   TERMINAL E BOTÕES
   ======================== */
.terminal {
  margin-top: 2.5rem;
  width: 100%;
  max-width: 36rem;
  border: 1px solid var(--border);
  background-color: rgba(0, 0, 0, 0.5);
  text-align: left;
  box-shadow: 0 0 60px -20px rgba(120,220,200,0.35);
  backdrop-filter: blur(4px);
}
.terminal-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--text-muted);
}
.term-dot { height: 8px; width: 8px; border-radius: 50%; opacity: 0.7; }
.dot-red { background-color: var(--destructive); }
.dot-yellow { background-color: #fbbf24; }
.dot-green { background-color: #34d399; }
.term-title { margin-left: 0.75rem; }

.terminal-body {
  padding: 1rem;
  font-size: 0.75rem;
  line-height: 1.5rem;
  color: var(--text-primary);
}
.term-user { color: #34d399; }
.term-colon { color: var(--text-muted); }
.term-cursor {
  display: inline-block;
  height: 0.75rem;
  width: 6px;
  transform: translateY(2px);
  background-color: var(--text-primary);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  margin-left: 2px;
}
.term-error { margin-top: 0.5rem; color: var(--destructive); }
.term-hint { color: var(--text-muted); }

/* Actions */
.action-buttons {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
.btn-return {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--foreground);
  background-color: var(--text-primary);
  padding: 0.625rem 1.25rem;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  color: var(--bg-app);
  transition: background-color 0.2s;
  text-decoration: none;
}
.btn-return:hover { background-color: var(--bg-panel-right); color: var(--text-primary); }

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  padding: 0.625rem 1.25rem;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  color: var(--text-primary);
  transition: all 0.2s;
  cursor: pointer;
}
.btn-back:hover {
  border-color: rgba(255, 255, 255, 0.6);
  color: var(--foreground);
}

/* Footer */
.bottom-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: oklch(0.704 0.04 256.788 / 0.6);
}

/* Animações do Cofre */
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes spin-reverse { to { transform: rotate(-360deg); } }
@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}
@keyframes pulse {
  50% { opacity: 0.5; }
}
</style>