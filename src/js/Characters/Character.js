/* eslint-disable no-underscore-dangle */
export default class Character {
  constructor(level, type = 'generic') {
    if (new.target.name === 'Character') throw new Error('Using "new Character()" not allowed');
    if (!level && type === 'generic') throw new Error('Using "new Character()" not allowed');
    this._type = type;
    this._level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.attackRadius = 1;
    this.moveRadius = 1;
  }

  get type() {
    return this._type;
  }

  get level() {
    return this._level;
  }

  set level(value) {
    if (this.level > value) throw new Error("Can't decrease level");
    while (this.level < value) this.levelUp();
  }

  damage(points) {
    this.health -= points;
    if (this.health < 0) this.health = 0;
  }

  damageFromCharacter(attacker) {
    const points = Math.max(attacker.attack - this.defence, attacker.attack * 0.1);
    this.damage(points);
    return points;
  }

  levelUp() {
    if (this.health === 0) {
      throw new Error("Can't level up dead character");
    }
    this._level += 1;
    this.attack = Math.max(this.attack, this.attack + ((this.health / 10) - 1.8));
    this.defence = Math.max(this.defence, this.defence + ((this.health / 10) - 1.8));
    this.health += 80;
    if (this.health > 100) this.health = 100;
  }
}
