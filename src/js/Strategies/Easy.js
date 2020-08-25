import Strategy from './Strategy';

export default class RandomMove extends Strategy {
  async nextStep() {
    // If can - attack
    const attackingBots = this.getBotsWhoCanAttack();
    if (attackingBots.length) {
      const attackingBot = attackingBots[Math.round(Math.random() * (attackingBots.length - 1))];
      const positionedBot = this.gameController.getPositionedCharacter(attackingBot.bot);
      const index = positionedBot.position;

      // Random select character
      this.gameController.onCellClick(index, true);

      // Random attack
      await this.gameController.onCellClick(
        attackingBot.cells[Math.round(Math.random() * (attackingBot.cells.length - 1))],
        true,
      );
      return;
    }

    // If can't attack - random move
    // Random select character
    const bots = this.gameController.currentTeam.toArray();
    const bot = bots[Math.round(Math.random() * (bots.length - 1))];
    const positionedBot = this.gameController.getPositionedCharacter(bot);
    const index = positionedBot.position;
    this.gameController.onCellClick(index, true);

    // Random move
    const cellsToMove = this.getAvailableCellsToMove(bot);
    await this.gameController.onCellClick(
      cellsToMove[Math.round(Math.random() * (cellsToMove.length - 1))],
      true,
    );
  }

  getBotsWhoCanAttack() {
    const BotsWhoCanAttack = [];
    const bots = this.gameController.currentTeam.toArray();
    for (const bot of bots) {
      const cells = this.getAvailableCellsToAttack(bot);
      if (cells.length > 0) BotsWhoCanAttack.push({ bot, cells });
    }
    return BotsWhoCanAttack;
  }

  getAvailableCellsToAttack(bot) {
    const availableCells = [];
    for (let cell = 0; cell < this.gameController.gamePlay.boardSize ** 2; cell += 1) {
      if (this.gameController.canAttack(bot, cell)) availableCells.push(cell);
    }
    return availableCells;
  }

  getAvailableCellsToMove(bot) {
    const availableCells = [];
    for (let cell = 0; cell < this.gameController.gamePlay.boardSize ** 2; cell += 1) {
      if (this.gameController.canMove(bot, cell)) availableCells.push(cell);
    }
    return availableCells;
  }
}
