export default class Character {
  constructor(level, type = 'generic') {
    if (new.target.name === 'Character') throw new Error('Using "new Character()" not allowed');
    if (!level && type === 'generic') throw new Error('Using "new Character()" not allowed');
    this.private = {
      type,
      level,
      attack: 0,
      defence: 0,
      health: 100,
      attackRadius: 1,
      moveRadius: 1,
      // powerModeAttacks: 0,
      // powerModeUsed: false,
    };
  }

  get type() {
    return this.private.type;
  }

  get level() {
    return this.private.level;
  }

  set level(value) {
    if (this.level > value) throw new Error("Can't decrease level");
    while (this.level < value) this.levelUp();
  }

  // get powerModeEnabled() {
  //   if (this.private.powerModeAttacks) return true;
  //   return false;
  // }

  // enablePowerMode() {
  //   if (this.private.powerModeUsed) return false;
  //   this.private.powerModeAttacks = 3;
  //   this.private.powerModeUsed = true;
  //   return true;
  // }

  get attack() {
    // if (this.private.powerModeAttacks) {
    //   this.private.powerModeAttacks -= 1;
    //   return this.private.attack * 2;
    // }
    return this.private.attack;
  }

  get health() {
    if (this.private.powerModeAttacks) return this.private.health * 2;
    return this.private.health;
  }

  get defence() {
    if (this.private.powerModeAttacks) return this.private.defence * 2;
    return this.private.defence;
  }

  damage(points) {
    this.private.health -= points;
    if (this.health < 0) this.private.health = 0;
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
    this.private.level += 1;
    this.private.attack = Math.max(this.attack, this.attack * (0.8 + this.health / 100));
    this.private.defence = Math.max(this.defence, this.defence * (0.8 + this.health / 100));
    this.private.health += 80;
    if (this.private.health > 100) this.private.health = 100;
  }
}
