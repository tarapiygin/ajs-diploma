import themes from './themes';
import { generateTeam, characterGenerator } from './generators';
import Bowman from './Characters/Bowman';
import Swordsman from './Characters/Swordsman';
import Magician from './Characters/Magician';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';
import Daemon from './Characters/Daemon';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';
import { calcRow, calcColumn, makeTooltip } from './utils';
// import RandomMove from './Strategies/RandomMove';
import Easy from './Strategies/Easy';
import Team from './Team';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.stepEnabled = true;
  }

  init() {
    // Adding event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));

    // Loading saved state from stateService
    this.loadGame();
  }

  newGame() {
    this.gameState = new GameState();
    this.nextLevel();
  }

  saveGame() {
    this.gameState.boardEntries = [...this.gameState.board.entries()];
    this.stateService.save(this.gameState);
    delete this.gameState.boardEntries;
    GamePlay.showMessage('Game saved');
  }

  loadGame() {
    let loadedGameState;
    try {
      loadedGameState = GameState.from(this.stateService.load());
      if (!loadedGameState.board.size) throw new Error('Load error');
    } catch (e) {
      if (!this.gameState) this.newGame();
      GamePlay.showError('Nothing to load');
      return;
    }
    this.gameState = loadedGameState;
    this.userTeam = new Team();
    this.botTeam = new Team();
    for (const positionedCharacter of this.gameState.board.values()) {
      switch (positionedCharacter.character.type) {
        default:
        case 'bowman':
        case 'swordsman':
        case 'magician':
          this.userTeam.add(positionedCharacter.character);
          break;
        case 'daemon':
        case 'undead':
        case 'vampire':
          this.botTeam.add(positionedCharacter.character);
          break;
      }
    }
    this.drawBoard(this.gameState.level);
    this.gamePlay.redrawPositions(this.gameState.board.values());
    if (this.isCharacterSelected) this.selectCharacter(this.selectedCharacterIndex);
  }

  onCellEnter(index) {
    // Don't react while ai doing its step
    if (!this.gameState.userStep) return;

    // Making tooltip
    if (this.isCharacterExistsInCell(index)) {
      const { character } = this.gameState.board.get(index);
      this.gamePlay.showCellTooltip(makeTooltip(character), index);
    }

    // Changing cursor
    (() => {
      if (this.isCharacterSelected) {
        // Selecting another user character
        if (
          this.gameState.board.has(index)
          && this.currentTeam.has(this.gameState.board.get(index).character)
        ) {
          this.gamePlay.setCursor(cursors.pointer);
          return;
        }

        // Moving
        if (this.canMove(this.selectedCharacter, index)) {
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
          return;
        }

        // Attacking
        if (this.canAttack(this.selectedCharacter, index)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
          return;
        }
        this.gamePlay.setCursor(cursors.notallowed);
        return;
      }
      if (
        this.gameState.board.has(index)
        && this.currentTeam.has(this.gameState.board.get(index).character)
      ) {
        this.gamePlay.setCursor(cursors.pointer);
        return;
      }
      this.gamePlay.setCursor(cursors.notallowed);
    })();
  }

  onCellLeave(index) {
    // Hiding tooltip
    this.gamePlay.hideCellTooltip(index);

    if (this.isCharacterSelected && index !== this.gameState.selectedCharacterIndex) {
      this.gamePlay.deselectCell(index);
    }

    this.gamePlay.setCursor(cursors.auto);
  }

  async onCellClick(index, force = false) {
    if (!this.gameState.userStep && !force) return;

    // If character selected
    if (this.isCharacterSelected) {
      // Moving
      if (this.canMove(this.selectedCharacter, index)) {
        this.stepEnabled = false;
        this.gameState.board.set(
          index,
          this.gameState.board.get(this.gameState.selectedCharacterIndex),
        );
        this.gameState.board.get(index).position = index;
        this.gameState.board.delete(this.gameState.selectedCharacterIndex);
        this.deselectAllCells();
        this.gamePlay.redrawPositions(this.gameState.board.values());
        this.nextStep();
        return;
      }

      // Attacking
      if (this.canAttack(this.selectedCharacter, index)) {
        this.stepEnabled = false;

        const attacker = this.selectedCharacter;
        const target = this.gameState.board.get(index).character;

        const damagePoints = Number(target.damageFromCharacter(attacker).toFixed(1));

        this.gamePlay.showDamage(index, damagePoints).then(() => {
          if (target.health === 0) {
            this.gameState.board.delete(index);
            this.anotherTeam.delete(target);
            this.deselectAllCells();
            if (this.anotherTeam.size === 0) {
              if (this.gameState.userStep) {
                this.gameState.points = Number(this.calcPoints().toFixed(1));
                GamePlay.showMessage(
                  `Level ${this.gameState.level} complete!
Your score - ${this.gameState.points}!
Last record - ${this.record}`,
                );
                this.nextLevel(this.gameState.level += 1);
                this.stepEnabled = true;
                return;
              }
              GamePlay.showMessage('You lose!');
              this.gamePlay.redrawPositions(this.gameState.board.values());
              this.stepEnabled = true;
              return;
            }
          }
          this.gamePlay.redrawPositions(this.gameState.board.values());
          this.nextStep();
        });
        return;
      }
    }

    this.deselectAllCells();

    // Selecting character
    if (this.isCharacterExistsInCell(index)) {
      const { character } = this.gameState.board.get(index);
      if (this.currentTeam.has(character)) {
        this.selectCharacter(index);
        return;
      }
      GamePlay.showError("You can't select this character");
    }
  }

  nextStep() {
    this.stepEnabled = true;
    this.deselectAllCells();
    this.gameState.userStep = !this.gameState.userStep;
    if (!this.gameState.userStep) {
      const ai = new Easy(this);
      ai.nextStep();
    }
  }

  drawBoard(level) {
    let theme;
    switch (level) {
      default:
      case 1: theme = themes.prairie; break;
      case 2: theme = themes.desert; break;
      case 3: theme = themes.arctic; break;
      case 4: theme = themes.mountain; break;
    }
    this.gamePlay.drawUi(theme);
  }

  nextLevel(level = 1) {
    const getRandomPosition = (isUserTeam = true) => {
      const startColumn = isUserTeam ? 0 : this.gamePlay.boardSize - 2;
      const position = Math.round(Math.random() * (this.gamePlay.boardSize - 1))
       * this.gamePlay.boardSize;
      return position + startColumn + Math.round(Math.random());
    };

    const fillBoard = (team, isUserTeam) => {
      for (const character of team) {
        let newPosition = getRandomPosition(isUserTeam);
        while (this.gameState.board.has(newPosition)) newPosition = getRandomPosition(isUserTeam);
        this.gameState.board.set(newPosition, new PositionedCharacter(character, newPosition));
      }
    };

    this.gameState.board = new Map();
    this.drawBoard(level);
    if (this.record < this.gameState.points) {
      this.record = this.gameState.points;
    }
    switch (level) {
      case 1:
        this.userTeam = generateTeam([Bowman, Swordsman], 1, 2);
        this.botTeam = generateTeam([Undead, Vampire, Daemon], 1, 2);
        break;
      case 2:
        this.userTeam.toArray().forEach((character) => character.levelUp());
        this.userTeam.add(characterGenerator([Bowman, Swordsman, Magician], 1).next().value);
        this.botTeam = generateTeam(
          [Undead, Vampire, Daemon],
          2,
          this.userTeam.size,
        );
        break;
      case 3:
        this.userTeam.toArray().forEach((character) => character.levelUp());
        this.userTeam.add(characterGenerator([Bowman, Swordsman, Magician], 2).next().value);
        this.userTeam.add(characterGenerator([Bowman, Swordsman, Magician], 2).next().value);
        this.botTeam = generateTeam(
          [Undead, Vampire, Daemon],
          3,
          this.userTeam.size,
        );
        break;
      case 4:
        this.gamePlay.drawUi(themes.mountain);
        this.userTeam.toArray().forEach((character) => character.levelUp());
        this.userTeam.add(characterGenerator([Bowman, Swordsman, Magician], 3).next().value);
        this.userTeam.add(characterGenerator([Bowman, Swordsman, Magician], 3).next().value);
        this.botTeam = generateTeam(
          [Undead, Vampire, Daemon],
          4,
          this.userTeam.size,
        );
        break;
      default:
        GamePlay.showMessage(
          `You win!
Your score - ${Number(this.calcPoints().toFixed(1))}!
${this.record === this.gameState.points ? 'NEW RECORD' : 'Last record'} - ${this.record}`,
        );
        return;
    }
    this.deselectAllCells();
    this.gameState.userStep = true;
    fillBoard(this.userTeam, true);
    fillBoard(this.botTeam, false);
    this.gamePlay.redrawPositions(this.gameState.board.values());
  }

  calcPoints() {
    let points = 0;
    for (const character of this.userTeam) points += character.health;
    return points;
  }

  deselectAllCells() {
    for (let cell = 0; cell < this.gamePlay.boardSize ** 2; cell += 1) {
      this.gamePlay.deselectCell(cell);
    }
    this.gameState.selectedCharacterIndex = -1;
  }

  isCharacterExistsInCell(cellIndex) {
    return this.gameState.board.has(cellIndex);
  }

  get record() {
    const points = this.stateService.loadRecord();
    return points || 0;
  }

  set record(points) {
    this.stateService.saveRecord(points);
  }

  get currentTeam() {
    return this.gameState.userStep ? this.userTeam : this.botTeam;
  }

  get anotherTeam() {
    return this.gameState.userStep ? this.botTeam : this.userTeam;
  }

  selectCharacter(index) {
    this.gamePlay.selectCell(index);
    this.gameState.selectedCharacterIndex = index;
    return this.selectedCharacter;
  }

  get isCharacterSelected() {
    return this.gameState.selectedCharacterIndex !== -1;
  }

  get selectedCharacter() {
    if (this.isCharacterSelected) {
      return this.gameState.board.get(this.gameState.selectedCharacterIndex).character;
    }
    return null;
  }

  get selectedCharacterIndex() {
    return this.gameState.selectedCharacterIndex;
  }

  getRow(index) {
    return calcRow(index, this.gamePlay.boardSize);
  }

  getColumn(index) {
    return calcColumn(index, this.gamePlay.boardSize);
  }

  getPositionedCharacter(character) {
    for (const positionedCharacter of this.gameState.board.values()) {
      if (positionedCharacter.character === character) {
        return positionedCharacter;
      }
    }
    return null;
  }

  canMove(mover, tagretIndex) {
    if (!this.stepEnabled) return false;
    const row = this.getRow(tagretIndex);
    const column = this.getColumn(tagretIndex);
    const positionedMover = (mover.constructor.name !== 'PositionedCharacter')
      ? this.getPositionedCharacter(mover)
      : mover;

    const moverRow = this.getRow(positionedMover.position);
    const moverColumn = this.getColumn(positionedMover.position);

    return (
      row === moverRow
      || column === moverColumn
      || Math.abs(row - moverRow) === Math.abs(column - moverColumn)
    )
      && Math.abs(row - moverRow) <= positionedMover.character.moveRadius
      && Math.abs(column - moverColumn) <= positionedMover.character.moveRadius
      && !this.isCharacterExistsInCell(tagretIndex);
  }

  canAttack(attacker, tagretIndex) {
    if (!this.stepEnabled) return false;
    const row = this.getRow(tagretIndex);
    const column = this.getColumn(tagretIndex);
    const positionedAttacker = (attacker.constructor.name !== 'PositionedCharacter')
      ? this.getPositionedCharacter(attacker)
      : attacker;

    const attackerRow = this.getRow(positionedAttacker.position);
    const attackerColumn = this.getColumn(positionedAttacker.position);

    return Math.abs(row - attackerRow) <= positionedAttacker.character.attackRadius
      && Math.abs(column - attackerColumn) <= positionedAttacker.character.attackRadius
      && this.gameState.board.has(tagretIndex)
      && this.anotherTeam.has(this.gameState.board.get(tagretIndex).character);
  }
}
