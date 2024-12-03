import axios from "axios";
import { Pokemon } from "../type";
import { GENERATIONS } from "../constants";

export class PokedexService {
  private static instance: PokedexService;
  private URL_PATH: string;

  private constructor() {
    this.URL_PATH = "http://localhost:8080/pokemon";
  }

  public static getInstance() {
    if (!PokedexService.instance) {
      PokedexService.instance = new PokedexService();
    }
    return PokedexService.instance;
  }

  async getPokemons() {
    console.log("getPokemons was called");
    try {
      const res = await axios.get(`${this.URL_PATH}`);
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

  // todo can be used for single pokemon as well
  /*
    1. pokemonId is "1 index" 
    2. pokemonId usually end of gen number
      i.g) 151, 649 ...
   */

  async getMultiplePokemonDetails(
    pokemonId: string,
    isRange = false
  ): Promise<Pokemon[]> {
    const res = await axios.get(
      `${this.URL_PATH}/${pokemonId}?isRange=${isRange}`
    );
    return res.data;
  }

  async getPokemonsByGen(genId: string): Promise<Pokemon[]> {
    const res = await axios.get(`${this.URL_PATH}/gen/${genId}`);
    return res.data;
  }

  // remove
  async getAllPokemonBGMs() {
    const res = await axios.get(`${this.URL_PATH}/musics`);
    return res.data;
  }

  async getAllPokemons() {
    const res = await axios.get(`${this.URL_PATH}/all`);
    return res.data;
  }
}
