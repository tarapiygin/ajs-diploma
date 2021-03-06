import Character from './Character';

class Vampire extends Character {
  constructor(level = 1) {
    super(1, 'vampire');
    this.attack = 40;
    this.defence = 10;
    this.attackRadius = 2;
    this.moveRadius = 2;
    this.level = level;
  }
}

export default Vampire;
