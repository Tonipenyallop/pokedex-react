import axios from "axios";

export class PokedexService {
  private static instance: PokedexService;

  private constructor() {}

  public static getInstance() {
    if (!PokedexService.instance) {
      PokedexService.instance = new PokedexService();
    }
    return PokedexService.instance;
  }

  async getPokemons() {
    console.log("getPokemons was called");
    try {
      const res = await axios.get(`http://localhost:8080/pokemon`);
      if (!res) {
        throw new Error("failed to fetch pokemon");
      }
      console.log("res.data", res.data.results);
      return res.data.results;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          `Failed to fetch pokemons: ${
            err.response
              ? `Status ${err.response.status} - ${err.response.statusText}`
              : err.message
          }`
        );
      } else {
        throw new Error(`unknown error happened: ${err}`);
      }
    }
  }
}
