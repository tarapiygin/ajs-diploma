import Character from './Character';

class Swordsman extends Character {
  constructor(level = 1) {
    super(1, 'swordsman');
    this.private.attack = 40;
    this.private.defence = 10;
    this.attackRadius = 1;
    this.moveRadius = 4;
    this.level = level;
  }
}

export default Swordsman;
