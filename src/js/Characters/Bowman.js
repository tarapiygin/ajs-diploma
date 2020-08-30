import Character from './Character';

class Bowman extends Character {
  constructor(level = 1) {
    super(1, 'bowman');
    this.attack = 25;
    this.defence = 25;
    this.attackRadius = 2;
    this.moveRadius = 2;
    this.level = level;
  }
}

export default Bowman;
