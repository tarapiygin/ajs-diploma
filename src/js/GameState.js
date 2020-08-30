/* eslint-disable no-underscore-dangle */
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
        switch (entry[1].character._type) {
          case 'bowman': Type = Bowman; break;
          case 'swordsman': Type = Swordsman; break;
          case 'magician': Type = Magician; break;
          case 'undead': Type = Undead; break;
          case 'vampire': Type = Vampire; break;
          case 'daemon': Type = Daemon; break;
          default: throw new Error('Wrong character type');
        }
        const character = new Type();
        character.attack = entry[1].character.attack;
        character.defence = entry[1].character.defence;
        character.health = entry[1].character.health;
        character.attackRadius = entry[1].character.attackRadius;
        character.moveRadius = entry[1].character.moveRadius;
        character._level = entry[1].character._level;

        gameState.board.set(
          entry[0],
          new PositionedCharacter(character, entry[1].position),
        );
      }
    }
    return gameState;
  }
}
