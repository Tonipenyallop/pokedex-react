import { useState } from "react";

import "./PokeDex.css";
import { PokedexService } from "./services/pokedex-service";

function PokeDex() {
  const [count, setCount] = useState(0);
  const pokemons = Array.from({ length: 5 }, (_val, idx) => ({
    name: `pokemon${idx}`,
  }));
  const pokemonService = PokedexService.getInstance();

  return (
    <div className="pokedex-container">
      {pokemons.map((pokemon) => (
        <div className="">{pokemon.name}</div>
      ))}
      <button onClick={pokemonService.getPokemons}>CLICK</button>
    </div>
  );
}

export default PokeDex;
