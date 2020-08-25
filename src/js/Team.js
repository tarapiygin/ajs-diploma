/**
 * Team class. Includes members set without doubles
 * @class
 */
class Team {
  constructor() {
    this.members = new Set();
  }

  /**
   * Add new unique character in the team members set
   * @param {Character} character
   * @throws if character is in the members set already
   */
  add(character) {
    // if (this.members.has(character)) {
    //   throw new Error('Character is in the members set already');
    // }
    this.members.add(character);
  }

  /**
   * Add some new unique characters in the team members set
   * @param  {...Character} rest
   */
  addAll(...rest) {
    for (const character of rest) this.members.add(character);
  }

  /**
   * Returns team members as array
   */
  toArray() {
    return [...this.members];
  }

  * [Symbol.iterator]() {
    for (const member of this.members) {
      yield member;
    }
    return 0;
  }

  get size() {
    return this.members.size;
  }

  has(character) {
    return this.members.has(character);
  }

  delete(character) {
    return this.members.delete(character);
  }
}

export default Team;
