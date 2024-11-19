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

  getPokemons() {
    console.log("getPokemons was called");
    // const PORT = "8080";
    // axios.get(`http://localhost:8080`);

    // const res = (await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=151`))
    //   .data.results;
    // console.log("res", res);
  }
}
