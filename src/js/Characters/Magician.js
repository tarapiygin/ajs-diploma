import Character from './Character';

class Magician extends Character {
  constructor(level = 1) {
    super(1, 'magician');
    this.attack = 10;
    this.defence = 40;
    this.attackRadius = 4;
    this.moveRadius = 1;
    this.level = level;
  }
}

export default Magician;
