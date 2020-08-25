import Bowman from './Characters/Bowman';
import Swordsman from './Characters/Swordsman';
import Magician from './Characters/Magician';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';
import Daemon from './Characters/Daemon';
import PositionedCharacter from './PositionedCharacter';

export default class GameState {
  constructor() {
    this.board = new Map();
    this.level = 1;
    this.userStep = true;
    this.selectedCharacterIndex = -1;
    this.points = 0;
  }

  static from(object) {
    // TODO: create object
    const gameState = new GameState();
    if (object.level) gameState.level = object.level;
    if (object.userStep) gameState.userStep = object.userStep;
    if (object.selectedCharacterIndex) {
      gameState.selectedCharacterIndex = object.selectedCharacterIndex;
    }
    if (object.points) gameState.points = object.points;
    if (object.boardEntries) {
      for (const entry of object.boardEntries) {
        let Type;
        switch (entry[1].character.private.type) {
          case 'bowman': Type = Bowman; break;
          case 'swordsman': Type = Swordsman; break;
          case 'magician': Type = Magician; break;
          case 'undead': Type = Undead; break;
          case 'vampire': Type = Vampire; break;
          case 'daemon': Type = Daemon; break;
          default: throw new Error('Wrong character type');
        }
        const character = new Type();
        character.private.attack = entry[1].character.private.attack;
        character.private.defence = entry[1].character.private.defence;
        character.private.health = entry[1].character.private.health;
        character.private.attackRadius = entry[1].character.private.attackRadius;
        character.private.moveRadius = entry[1].character.private.moveRadius;
        character.private.level = entry[1].character.private.level;

        gameState.board.set(
          entry[0],
          new PositionedCharacter(character, entry[1].position),
        );
      }
    }
    return gameState;
  }
}
