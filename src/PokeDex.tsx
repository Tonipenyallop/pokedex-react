import { useState, useEffect } from "react";
import "./PokeDex.css";
import { pokeDexService } from "./services/pokedex-service";
import { GenId, Pokemon } from "./type";
import { PokeDexJSXHelper } from "./helpers/PokeDex.tsx";
import PokemonCard from "./PokemonCard.tsx";
import { GEN_ID_KEY } from "./constants.ts";
import Loading from "./Loading.tsx";

const PokeDex = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGen, setActiveGen] = useState<string>(
    () => localStorage.getItem(GEN_ID_KEY) || "all",
  );

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const genIdInLocalStorage = localStorage.getItem(GEN_ID_KEY);

        const pokemons =
          genIdInLocalStorage && genIdInLocalStorage !== "all"
            ? await pokeDexService.getPokemonsByGen(
                genIdInLocalStorage as GenId,
              )
            : await pokeDexService.getAllPokemons();

        setPokemons(pokemons);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPokemons();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  async function handleGenButtonClick(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    const generationId = event.currentTarget.value as GenId | "all";
    let pokemons;
    if (generationId === "all") {
      pokemons = await pokeDexService.getAllPokemons();
    } else {
      pokemons = await pokeDexService.getPokemonsByGen(generationId);
    }

    setPokemons(pokemons);
    setActiveGen(generationId);
    localStorage.setItem(GEN_ID_KEY, generationId);
  }

  return (
    <div className="pokedex-container">
      <div className="generation-button-container">
        {PokeDexJSXHelper.renderGenerationButton({
          onClick: handleGenButtonClick,
          activeGen,
        })}
      </div>

      <PokemonCard pokemons={pokemons} />
    </div>
  );
};

export default PokeDex;
