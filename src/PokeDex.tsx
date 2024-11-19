import { useState, useEffect } from "react";

import "./PokeDex.css";
import { PokedexService } from "./services/pokedex-service";

const PokeDex = () => {
  const [pokemons, setPokemons] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const pokemonService = PokedexService.getInstance();
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await pokemonService.getPokemons();
        setPokemons(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPokemons();
  }, []);

  if (isLoading) {
    return;
  }

  return (
    <div className="pokedex-container">
      {pokemons.map((pokemon: { name: string; url: string }) => (
        <div className="" key={pokemon.name}>
          {pokemon.name}
        </div>
      ))}
      <button onClick={() => console.log("clicked")}>CLICK</button>
    </div>
  );
};

export default PokeDex;
