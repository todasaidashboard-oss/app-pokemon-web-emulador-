// Emulador de Game Boy usando GameBoy-Online (versão estática)
// Compatível com GitHub Pages sem dependência de CDN externa

let gb = null;

// Carrega o emulador
async function loadEmulator() {
  if (gb) return gb;

  const emulatorScript = document.createElement("script");
  emulatorScript.src = "https://cdn.jsdelivr.net/gh/taisel/GameBoy-Online@master/js/GameBoyCore.js";
  document.head.appendChild(emulatorScript);

  const emulatorUI = document.createElement("script");
  emulatorUI.src = "https://cdn.jsdelivr.net/gh/taisel/GameBoy-Online@master/js/GameBoyIO.js";
  document.head.appendChild(emulatorUI);

  return new Promise((resolve) => {
    emulatorUI.onload = () => {
      gb = new GameBoyCore(document.getElementById("screen"));
      resolve(gb);
    };
  });
}

// Carrega a ROM
async function loadRom() {
  const romBuffer = await fetch("pokemon-blue.gb").then((r) => r.arrayBuffer());
  const romBytes = new Uint8Array(romBuffer);

  gb.loadROM(romBytes);
}

// Iniciar o jogo
async function startGame() {
  await loadEmulator();
  await loadRom();
  gb.run();
}

// Pausar
function pauseGame() {
  if (gb) gb.stop();
}

// Resetar
function resetGame() {
  if (gb) {
    gb.stop();
    gb.reset();
    gb.run();
  }
}

document.getElementById("btn-start").addEventListener("click", startGame);
document.getElementById("btn-pause").addEventListener("click", pauseGame);
document.getElementById("btn-reset").addEventListener("click", resetGame);
