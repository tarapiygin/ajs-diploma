import Vampire from '../Characters/Vampire';

test('should not throw', () => {
  expect(() => new Vampire()).not.toThrow();
});
