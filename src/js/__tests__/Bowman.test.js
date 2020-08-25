import Bowman from '../Characters/Bowman';

test('should not throw', () => {
  expect(() => new Bowman()).not.toThrow();
});
