import { useState, useEffect, useRef } from "react";
import "./PokeDex.css";
import { PokedexService } from "./services/pokedex-service";
import { GenId, Pokemon } from "./type";
import { musics } from "./musics";
import { PokeDexHelper } from "./helpers/PokeDex.ts";
import { PokeDexJSXHelper } from "./helpers/PokeDex.tsx";
import PokemonCard from "./PokemonCard.tsx";
import { GEN_ID_KEY } from "./constants.ts";

const PokeDex = () => {
  // pallet town music
  const [musicIndex, setMusicIndex] = useState(1);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pokemonService = PokedexService.getInstance();

  const [pokemonSelected, setPokemonSelected] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const pokedexHelper = new PokeDexHelper({
    musicIndex,
    setMusicIndex,
    audioRef,
  });

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const genIdInLocalStorage = localStorage.getItem(GEN_ID_KEY);

        const pokemons =
          genIdInLocalStorage && genIdInLocalStorage !== "all"
            ? await pokemonService.getPokemonsByGen(
                genIdInLocalStorage as GenId
              )
            : await pokemonService.getAllPokemons();

        setPokemons(pokemons);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPokemons();
  }, []);

  const handlePlayNext = () => {
    pokedexHelper.playNextMusic();
  };

  const handlePlayPrev = () => {
    pokedexHelper.playPrevMusic();
  };

  if (isLoading) {
    return;
  }

  async function handleGenButtonClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    const generationId = event.currentTarget.value as GenId | "all";
    let pokemons;
    if (generationId === "all") {
      pokemons = await pokemonService.getAllPokemons();
    } else {
      pokemons = await pokemonService.getPokemonsByGen(generationId);
    }

    setPokemons(pokemons);
    localStorage.setItem(GEN_ID_KEY, generationId);
  }

  return (
    <div className="pokedex-container">
      <div className="">
        <div className="generation-button-container">
          {PokeDexJSXHelper.renderGenerationButton({
            onClick: handleGenButtonClick,
          })}
        </div>
        <div className="music-container">
          <button onClick={handlePlayPrev}>PREV MUSIC</button>
          <audio
            ref={audioRef}
            src={musics[musicIndex]}
            controls
            onEnded={handlePlayNext}
          />
          <button onClick={handlePlayNext}>NEXT MUSIC</button>
        </div>

        <PokemonCard pokemons={pokemons} onClick={setPokemonSelected} />
      </div>
    </div>
  );
};

export default PokeDex;
