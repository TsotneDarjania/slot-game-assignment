export class UI {
  game_ui;
  spin_button;
  stop_button;

  constructor() {
    this.game_ui = document.getElementById("game_ui");
    this.spin_button = document.getElementById("spin_button");
    this.stop_button = document.getElementById("stop_button");
  }

  display() {
    this.game_ui.style.display = "block";
  }

  disableStopButton() {
    this.stop_button.disabled = true;
    this.stop_button.style.pointerEvents = "none";

    this.stop_button.style.opacity = "0.5";
  }

  enableStopButton() {
    this.stop_button.disabled = false;
    this.stop_button.style.pointerEvents = "auto";

    this.stop_button.style.opacity = "1";
  }

  hideStopButton() {
    this.stop_button.style.display = "none";
  }

  showStopButton() {
    this.stop_button.style.display = "block";
  }

  disableSpinButton() {
    this.spin_button.disabled = true;
    this.spin_button.style.pointerEvents = "none";
  }

  hideSpinButton() {
    this.spin_button.style.display = "none";
  }

  showSpinButton() {
    this.spin_button.style.display = "block";
  }

  addEventListeners(handlers) {
    this.spin_button.addEventListener("click", handlers.handleStartSpin);
    this.stop_button.addEventListener("click", handlers.handleStopSpin);
  }
}
