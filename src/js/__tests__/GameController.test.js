import GameController from '../GameController';
import cursors from '../cursors';
import GamePlay from '../GamePlay';

const gamePlay = {
  setCursor: jest.fn(),
  selectCell: jest.fn(),
  deselectCell: jest.fn(),
  showCellTooltip: jest.fn(),
  hideCellTooltip: jest.fn(),
  addCellEnterListener: jest.fn(),
  addCellLeaveListener: jest.fn(),
  addCellClickListener: jest.fn(),
  addNewGameListener: jest.fn(),
  addSaveGameListener: jest.fn(),
  addLoadGameListener: jest.fn(),
  redrawPositions: jest.fn(),
  showDamage: jest.fn(),
  drawUi: jest.fn(),
  boardSize: 8,
};

GamePlay.showError = jest.fn();
GamePlay.showMessage = jest.fn();

const goodStateService = {
  save: jest.fn(),
  saveRecord: jest.fn(),
  loadRecord: () => 100,
  load: () => JSON.parse('{"board":{},"level":1,"userStep":true,"selectedCharacterIndex":-1,"points":0,"boardEntries":[[8,{"character":{"private":{"type":"swordsman","level":1,"attack":40,"defence":10,"health":100,"attackRadius":1,"moveRadius":1},"attackRadius":1,"moveRadius":4},"position":8}],[30,{"character":{"private":{"type":"daemon","level":1,"attack":10,"defence":40,"health":100,"attackRadius":1,"moveRadius":1},"attackRadius":4,"moveRadius":1},"position":30}],[16,{"character":{"private":{"type":"vampire","level":1,"attack":40,"defence":10,"health":100,"attackRadius":1,"moveRadius":1},"attackRadius":2,"moveRadius":2},"position":16}],[34,{"character":{"private":{"type":"bowman","level":1,"attack":25,"defence":25,"health":99,"attackRadius":1,"moveRadius":1},"attackRadius":2,"moveRadius":2},"position":34}]]}'),
};

const badStateService1 = {
  save: jest.fn(),
  saveRecord: jest.fn(),
  loadRecord: () => 100,
  load: () => { throw new Error('Invalid state'); },
};

const badStateService2 = {
  save: jest.fn(),
  saveRecord: jest.fn(),
  loadRecord: () => 100,
  load: () => JSON.parse('{"board":{},"level":1,"userStep":true,"selectedCharacterIndex":-1,"points":0}'),
};

test('should show right cursors', () => {
  const gameController = new GameController(gamePlay, goodStateService);

  gameController.init();
  gameController.onCellEnter(30);
  expect(gamePlay.setCursor).toHaveBeenLastCalledWith(cursors.notallowed);
  gameController.onCellEnter(8);
  expect(gamePlay.setCursor).toHaveBeenLastCalledWith(cursors.pointer);
  gameController.onCellLeave(8);
  expect(gamePlay.setCursor).toHaveBeenLastCalledWith(cursors.auto);
  gameController.onCellEnter(9);
  expect(gamePlay.setCursor).toHaveBeenLastCalledWith(cursors.notallowed);
  expect(gamePlay.selectCell).not.toHaveBeenCalled();

  gameController.onCellClick(8);
  expect(gamePlay.selectCell).toHaveBeenLastCalledWith(8);
  gameController.onCellEnter(9);
  expect(gamePlay.setCursor).toHaveBeenLastCalledWith(cursors.pointer);
  expect(gamePlay.selectCell).toHaveBeenLastCalledWith(9, 'green');
  gameController.onCellEnter(16);
  expect(gamePlay.setCursor).toHaveBeenLastCalledWith(cursors.crosshair);
  expect(gamePlay.selectCell).toHaveBeenLastCalledWith(16, 'red');
});

test('should show right tooltip', () => {
  const gameController = new GameController(gamePlay, goodStateService);

  gamePlay.showCellTooltip.mockClear();
  gameController.init();
  gameController.onCellEnter(0);
  expect(gamePlay.showCellTooltip).not.toHaveBeenCalled();

  gameController.onCellEnter(8);
  expect(gamePlay.showCellTooltip).toHaveBeenLastCalledWith(`${String.fromCodePoint(0x1F396)}1
${String.fromCodePoint(0x2694)}40
${String.fromCodePoint(0x1F6E1)}10
${String.fromCodePoint(0x2764)}100`, 8);

  gameController.onCellLeave(8);
  expect(gamePlay.hideCellTooltip).toHaveBeenCalledWith(8);
});

test('should show error message', () => {
  let gameController = new GameController(gamePlay, badStateService1);
  GamePlay.showError.mockClear();
  gameController.init();
  expect(GamePlay.showError).toHaveBeenCalled();

  gameController = new GameController(gamePlay, badStateService2);
  GamePlay.showError.mockClear();
  gameController.init();
  expect(GamePlay.showError).toHaveBeenCalled();
});
