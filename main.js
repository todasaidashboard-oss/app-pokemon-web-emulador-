let player = null;

// Carrega o emulador e a ROM
async function loadEmulator() {
    const screen = document.getElementById("screen");

    // Carrega o WasmBoy (emulador moderno)
    await WasmBoy.loadWasmBoy({
        isGbcEnabled: false,
        frameSkip: 1,
        audioBatchProcessing: true,
        timersBatchProcessing: true
    });

    // Carrega a ROM Pokémon Blue
    const romBuffer = await fetch("pokemon-blue.gb").then(r => r.arrayBuffer());

    // Inicia o jogo
    const wasmInstance = await WasmBoy.createWasmBoy(screen, {
        gameBoyColorMode: false,
        isAudioEnabled: true
    });

    await wasmInstance.loadROM(new Uint8Array(romBuffer));

    return wasmInstance;
}

// BOTÕES
document.getElementById("btn-start").addEventListener("click", async () => {
    if (!player) {
        player = await loadEmulator();
    }
    player.play();
});

document.getElementById("btn-pause").addEventListener("click", () => {
    if (player) player.pause();
});

document.getElementById("btn-reset").addEventListener("click", () => {
    if (player) player.reset();
});
