import { calcTileType } from '../utils';

test('should return right tile type', () => {
  expect(calcTileType(0, 2)).toBe('top-left');
  expect(calcTileType(1, 2)).toBe('top-right');
  expect(calcTileType(2, 2)).toBe('bottom-left');
  expect(calcTileType(3, 2)).toBe('bottom-right');

  expect(calcTileType(0, 3)).toBe('top-left');
  expect(calcTileType(1, 3)).toBe('top');
  expect(calcTileType(2, 3)).toBe('top-right');
  expect(calcTileType(3, 3)).toBe('left');
  expect(calcTileType(4, 3)).toBe('center');
  expect(calcTileType(5, 3)).toBe('right');
  expect(calcTileType(6, 3)).toBe('bottom-left');
  expect(calcTileType(7, 3)).toBe('bottom');
  expect(calcTileType(8, 3)).toBe('bottom-right');
});
