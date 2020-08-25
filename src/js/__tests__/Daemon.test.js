import Daemon from '../Characters/Daemon';

test('should not throw', () => {
  expect(() => new Daemon()).not.toThrow();
});
