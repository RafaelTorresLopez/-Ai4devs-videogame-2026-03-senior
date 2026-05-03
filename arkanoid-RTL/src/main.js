import { Game } from "./game/game.js";

const canvas = document.getElementById("game");
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Canvas #game no encontrado");
}

const game = new Game(canvas);
game.start();
