export function parseMinMaxPlayers(
  minMaxPlayers: string
): [number, number | undefined] {
  let [minPlayers, maxPlayers] = minMaxPlayers.split("-");
  if (minPlayers && maxPlayers) {
    return [Number(minPlayers), Number(maxPlayers)];
  } else {
    return [Number(minMaxPlayers), undefined];
  }
}

export function parseMinAge(minAge: string): number | undefined {
  const ageNumber = minAge.split("+")[0];
  return parseInt(ageNumber);
}
