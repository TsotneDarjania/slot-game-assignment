export class UI {
  game_ui;
  action_button;

  constructor() {
    this.game_ui = document.getElementById("game_ui");
    this.action_button = document.getElementById("action_button");
  }

  display() {
    this.game_ui.style.display = "block";
  }

  addEventListeners(handlers) {
    this.action_button.addEventListener("click", handlers.handleStartSpin);
  }
}
