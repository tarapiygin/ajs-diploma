import Swordsman from '../Characters/Swordsman';

test('should not throw', () => {
  expect(() => new Swordsman()).not.toThrow();
});
