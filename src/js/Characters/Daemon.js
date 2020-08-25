import Character from './Character';

class Daemon extends Character {
  constructor(level = 1) {
    super(1, 'daemon');
    this.private.attack = 10;
    this.private.defence = 40;
    this.attackRadius = 4;
    this.moveRadius = 1;
    this.level = level;
  }
}

export default Daemon;
