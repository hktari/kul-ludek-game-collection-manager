
export function parseMinMaxPlayers(minMaxPlayers: string): [number, number | undefined] {
    let [minPlayers, maxPlayers] = minMaxPlayers.split('-')
    if (minPlayers && maxPlayers) {
        return [Number(minPlayers), Number(maxPlayers)]
    } else {
        return [Number(minMaxPlayers), undefined]
    }
}
