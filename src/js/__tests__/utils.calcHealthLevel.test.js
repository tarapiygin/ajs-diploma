import { calcHealthLevel } from '../utils';

test('should return right health level', () => {
  expect(calcHealthLevel(0)).toBe('critical');
  expect(calcHealthLevel(14)).toBe('critical');
  expect(calcHealthLevel(15)).toBe('normal');
  expect(calcHealthLevel(49)).toBe('normal');
  expect(calcHealthLevel(50)).toBe('high');
});
