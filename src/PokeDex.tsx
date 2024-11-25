import { useState, useEffect, useRef } from "react";
import "./PokeDex.css";
import { PokedexService } from "./services/pokedex-service";
import { Pokemon } from "./type";
import { musics } from "./musics";
import { useNavigate } from "react-router";
import { PokeDexHelper } from "./helpers/PokeDex.ts";
import { PokeDexJSXHelper } from "./helpers/PokeDex.tsx";

const PokeDex = () => {
  // pallet town music
  const [musicIndex, setMusicIndex] = useState(1);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pokemonIds = "151";
  const pokemonService = PokedexService.getInstance();

  const navigate = useNavigate();
  function handleCardClicked(pokemonId: number) {
    console.log("clicked!");
    console.log("pokemonId", pokemonId);
    navigate(`/detail/${pokemonId.toString()}`);
  }

  const audioRef = useRef<HTMLAudioElement>(null);

  const pokedexHelper = new PokeDexHelper({
    musicIndex,
    setMusicIndex,
    audioRef,
  });

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const pokemons = await pokemonService.getMultiplePokemonDetails(
          pokemonIds
        );
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
    const generationId = event.currentTarget.value;
    const pokemons = await pokemonService.getPokemonsByGen(generationId);

    setPokemons(pokemons);
  }

  return (
    <div className="pokedex-container">
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
      <div className="pokemon-card-container">
        {pokemons.map((pokemon: Pokemon) => (
          <div
            className="pokemon-card"
            key={pokemon.name}
            onClick={() => handleCardClicked(pokemon.id)}
            defaultValue={pokemon.id}
          >
            <div className="pokemon-info-container">
              <div className="">{pokemon.name}</div>
              <div className="type-container">
                <div className="type">{pokemon.types[0].type.name}</div>
                <div className="type">
                  {pokemon.types[1] && pokemon.types[1].type.name}
                </div>
              </div>
            </div>

            <img src={pokemon.sprites.front_default || ""} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokeDex;
