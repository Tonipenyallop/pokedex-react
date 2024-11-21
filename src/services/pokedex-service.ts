import axios from "axios";
import { Pokemon } from "../type";

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

  // 1 index
  async getPokemonDetail(pokemonId: string): Promise<Pokemon> {
    const res = await axios.get(`${this.URL_PATH}/${pokemonId}`);
    return res.data;
  }

  async getMultiplePokemonDetails(pokemonIds: string[]): Promise<Pokemon[]> {
    const output: Pokemon[] = [];

    pokemonIds.forEach((pokemonId) => {
      output.push(this.getPokemonDetail(pokemonId));
    });

    return Promise.all(output);
  }

  // optimize later
  // async chunkGetPokemonDetails(pokemonIds : string[]){
  //   const half = Math.round(pokemonIds.length / 2);
  //   const front = pokemonIds.slice(0,half + 1)
  //   const back = pokemonIds.slice(half,pokemonIds.length + 1);
  // }

  async getAllPokemonBGMs() {
    const res = await axios.get(`${this.URL_PATH}/musics`);
    return res.data;
  }
}
