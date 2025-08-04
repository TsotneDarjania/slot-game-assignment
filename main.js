import { Game } from "./game/index.js";

const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

new Game(gameWidth, gameHeight);

// My Simple Way (temporary) to handle resize....
window.addEventListener("resize", () => window.location.reload());
