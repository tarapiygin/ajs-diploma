import Strategy from './Strategy';

export default class RandomMove extends Strategy {
  async nextStep() {
    const bots = this.gameController.currentTeam.toArray();
    this.bot = bots[Math.round(Math.random() * (bots.length - 1))];
    this.positionedBot = this.gameController.getPositionedCharacter(this.bot);
    this.index = this.positionedBot.position;

    // Select character
    this.gameController.onCellClick(this.index, true);

    // Random move
    const cellsToMove = this.getAvailableCellsToMove();
    await this.gameController.onCellClick(
      cellsToMove[Math.round(Math.random() * (cellsToMove.length - 1))],
      true,
    );
  }

  getAvailableCellsToMove() {
    const availableCells = [];
    for (let cell = 0; cell < this.gameController.gamePlay.boardSize ** 2; cell += 1) {
      if (this.gameController.canMove(this.bot, cell)) availableCells.push(cell);
    }
    return availableCells;
  }
}
