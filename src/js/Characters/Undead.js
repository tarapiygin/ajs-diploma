import Character from './Character';

class Undead extends Character {
  constructor(level = 1) {
    super(1, 'undead');
    this.attack = 25;
    this.defence = 25;
    this.attackRadius = 1;
    this.moveRadius = 4;
    this.level = level;
  }
}

export default Undead;
