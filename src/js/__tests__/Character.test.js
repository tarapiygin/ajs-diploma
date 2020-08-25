import Character from '../Characters/Character';

test('should throw', () => {
  expect(() => new Character()).toThrow();
});
