export class PhoneSystem {
  constructor() {
    this.overlay = document.getElementById('phoneOverlay');
    this.device = document.getElementById('phoneDevice');
    this.phoneHome = document.getElementById('phoneHome');
    this.bettingScreen = document.getElementById('bettingAppScreen');

    document.getElementById('phoneToggle').addEventListener('click', () => this.openPhone());
    document.getElementById('closePhone').addEventListener('click', () => this.closePhone());
    document.getElementById('openBettingApp').addEventListener('click', () => this.openBettingApp());
    document.getElementById('backToPhoneHome').addEventListener('click', () => this.openHome());

    this.overlay.addEventListener('click', (event) => {
      if (!this.device.contains(event.target)) {
        this.closePhone();
      }
    });
  }

  openPhone() {
    this.overlay.classList.remove('hidden');
  }

  closePhone() {
    this.overlay.classList.add('hidden');
    this.openHome();
  }

  openBettingApp() {
    this.phoneHome.classList.add('hidden');
    this.bettingScreen.classList.remove('hidden');
  }

  openHome() {
    this.bettingScreen.classList.add('hidden');
    this.phoneHome.classList.remove('hidden');
  }
}
