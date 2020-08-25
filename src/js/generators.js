import Team from './Team';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const currentClassID = Math.round(Math.random() * (allowedTypes.length - 1));
    const newCharacter = new allowedTypes[currentClassID]();
    newCharacter.level = Math.round(Math.random() * (maxLevel - 1)) + 1;
    yield newCharacter;
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const newTeam = new Team();
  const generateCharacter = characterGenerator(allowedTypes, maxLevel);
  while (newTeam.size < characterCount) {
    newTeam.add(generateCharacter.next().value);
  }
  return newTeam;
}
