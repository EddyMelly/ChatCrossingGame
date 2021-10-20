export function lavaDetection(lavaTile, player) {
  if (
    lavaTile.position.x == player.position.x &&
    lavaTile.position.y == player.position.y
  ) {
    return true;
  } else {
    return false;
  }
}
