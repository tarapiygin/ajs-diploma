export function calcTileType(index, boardSize) {
  if (index === 0) return 'top-left';
  if (index < boardSize - 1) return 'top';
  if (index === boardSize - 1) return 'top-right';
  if (index === boardSize ** 2 - 1) return 'bottom-right';
  if (index > boardSize ** 2 - boardSize) return 'bottom';
  if (index === boardSize ** 2 - boardSize) return 'bottom-left';
  if (index % boardSize === 0) return 'left';
  if (index % boardSize === boardSize - 1) return 'right';
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) return 'critical';
  if (health < 50) return 'normal';
  return 'high';
}

export function calcRow(index, boardSize) {
  return Math.floor(index / boardSize);
}

export function calcColumn(index, boardSize) {
  return index % boardSize;
}

export function makeTooltip(character) {
  return `${String.fromCodePoint(0x1F396)}${character.level}
${String.fromCodePoint(0x2694)}${Number(character.attack.toFixed(1))}
${String.fromCodePoint(0x1F6E1)}${Number(character.defence.toFixed(1))}
${String.fromCodePoint(0x2764)}${Number(character.health.toFixed(1))}`;
}
