export default class Game {
  constructor(
    public id: string,
    public boardGameGeekId: string,
    public title?: string,
    public description?: string,
    public minAge?: number,
    public maxAge?: number,
    public minPlayers?: number,
    public maxPlayers?: number,
    public genre?: string,
    public minPlaytime?: number,
    public maxPlaytime?: number,
    public developer?: string,
    public publisher?: string,
    public releaseDateISO?: string,
    public errors?: string
  ) {}
}
