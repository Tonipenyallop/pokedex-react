import axios from "axios";
import { GenId, Pokemon } from "../type";

class PokeDexService {
  private static instance: PokeDexService;
  private URL_PATH: string;

  private constructor() {
    console.log(
      "import.meta.env.VITE_URL_PATH is",
      import.meta.env.VITE_URL_PATH
    );

    // taesu comment out this value for dev env
    this.URL_PATH =
      import.meta.env.VITE_URL_PATH || "http://localhost:8080/pokemon";
  }

  public static getInstance() {
    if (!PokeDexService.instance) {
      PokeDexService.instance = new PokeDexService();
    }
    return PokeDexService.instance;
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

  async getPokemonDetails(pokemonId: string): Promise<Pokemon> {
    const res = await axios.get(`${this.URL_PATH}/${pokemonId}`);
    return res.data;
  }

  async getPokemonsByGen(genId: GenId): Promise<Pokemon[]> {
    const res = await axios.get(`${this.URL_PATH}/gen/${genId}`);
    return res.data;
  }

  async getMusicDescriptionByIndex(index: string) {
    const res = await axios.get(`${this.URL_PATH}/music/${index}`);
    return res.data;
  }

  async getAllPokemons() {
    const res = await axios.get(`${this.URL_PATH}/all`);
    return res.data;
  }

  async getEvolutionChainById(pokemonId: string) {
    const res = await axios.get(
      `${this.URL_PATH}/evolution-chain/${pokemonId}`
    );
    return res.data;
  }
}

export const pokeDexService = PokeDexService.getInstance();

export type PokeDexServiceType = typeof pokeDexService;
