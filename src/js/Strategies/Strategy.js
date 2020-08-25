export default class Strategy {
  constructor(gameController) {
    if (new.target.name === 'Strategy') throw new Error('Using "new Strategy()" not allowed');
    this.gameController = gameController;
  }

  nextStep() {
    // TODO: realize this method in children classes;
    this.gameController.nextStep();
  }
}
