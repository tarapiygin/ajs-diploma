import Undead from '../Characters/Undead';

test('should not throw', () => {
  expect(() => new Undead()).not.toThrow();
});
