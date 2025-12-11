// Emulador Pokémon Blue usando WasmBoy via CDN
// Tudo preparado para rodar em site estático (GitHub Pages)

let initialized = false;
let romLoaded = false;

async function ensureAudioContext() {
  try {
    if (window.AudioContext || window.webkitAudioContext) {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
    }
  } catch (e) {
    console.warn("Problema ao inicializar áudio:", e);
  }
}

async function initEmulator() {
  if (initialized) return;
  if (typeof WasmBoy === "undefined") {
    alert("Falha ao carregar o emulador. Verifique sua internet (CDN WasmBoy).");
    return;
  }

  const canvas = document.getElementById("screen");

  // Configuração básica do WasmBoy
  WasmBoy.config({
    headless: false,
    useGbcWhenAvailable: true,
    isAudioEnabled: true,
    frameSkip: 0,
    timersEnabled: true,
    audioBatchProcessing: true
  });

  await WasmBoy.initialize(canvas);
  initialized = true;
}

async function loadRom() {
  if (romLoaded) return;

  const romUrl = "pokemon-blue.gb";

  const response = await fetch(romUrl);
  if (!response.ok) {
    alert("Não consegui carregar a ROM pokemon-blue.gb");
    return;
  }
  const buffer = await response.arrayBuffer();
  await WasmBoy.loadROM(buffer);
  romLoaded = true;
}

async function startGame() {
  try {
    await ensureAudioContext();
    await initEmulator();
    await loadRom();
    await WasmBoy.play();
  } catch (e) {
    console.error(e);
    alert("Erro ao iniciar o jogo. Veja o console para mais detalhes.");
  }
}

async function pauseGame() {
  try {
    if (typeof WasmBoy !== "undefined") {
      await WasmBoy.pause();
    }
  } catch (e) {
    console.error(e);
  }
}

async function resetGame() {
  try {
    if (typeof WasmBoy !== "undefined") {
      await WasmBoy.reset();
      await WasmBoy.play();
    }
  } catch (e) {
    console.error(e);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const btnStart = document.getElementById("btn-start");
  const btnPause = document.getElementById("btn-pause");
  const btnReset = document.getElementById("btn-reset");

  btnStart.addEventListener("click", () => {
    startGame();
  });

  btnPause.addEventListener("click", () => {
    pauseGame();
  });

  btnReset.addEventListener("click", () => {
    resetGame();
  });
});
