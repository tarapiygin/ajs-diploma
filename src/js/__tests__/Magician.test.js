import Magician from '../Characters/Magician';

test('should not throw', () => {
  expect(() => new Magician()).not.toThrow();
});
