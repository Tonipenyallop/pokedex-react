import { useState, useEffect, useRef } from "react";
import "./PokeDex.css";
import { PokedexService } from "./services/pokedex-service";
import { GENERATIONS } from "./constants";
import { Pokemon } from "./type";
import { musics } from "./musics";

const BGM_MAX_NUM_IDX = 45;

const PokeDex = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 649 -> till BW
  // const pokemonIds = "151";
  // DP
  const pokemonIds = "493";
  // const pokemonIds = "649";
  const pokemonService = PokedexService.getInstance();

  // pallet town music
  const [musicIndex, setMusicIndex] = useState(1);

  function playNextMusic() {
    const newIdx = (musicIndex + 1) % BGM_MAX_NUM_IDX;
    setMusicIndex(newIdx);
    setTimeout(() => {
      if (audioRef.current === null) {
        return;
      }
      audioRef.current.play();
    }, 1000);
  }

  function playPrevMusic() {
    const newIdx = musicIndex === 0 ? BGM_MAX_NUM_IDX - 1 : musicIndex - 1;
    setMusicIndex(newIdx);
    setTimeout(() => {
      if (audioRef.current === null) {
        return;
      }
      audioRef.current.play();
    }, 1000);
  }

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

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleEnded = () => {
    console.log("handleEnded was called");
    playNextMusic(); // Automatically play the next song
  };

  const handlePlayNext = () => {
    playNextMusic();
    if (audioRef.current) {
      audioRef.current.play(); // Play the next song
    }
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

  function renderGenerationButton() {
    return Array.from({ length: GENERATIONS.length }, (_, idx) => (
      <button
        value={GENERATIONS[idx].genId}
        onClick={handleGenButtonClick}
        title={GENERATIONS[idx].title}
      >
        {GENERATIONS[idx].title}
      </button>
    ));
  }

  return (
    <div className="pokedex-container">
      <div className="generation-button-container">
        {renderGenerationButton()}
      </div>
      <div className="music-container">
        <button onClick={playPrevMusic}>PREV MUSIC</button>
        <audio
          ref={audioRef}
          src={musics[musicIndex]}
          controls
          onEnded={handleEnded}
        />
        <button onClick={handlePlayNext}>NEXT MUSIC</button>
      </div>
      <div className="pokemon-card-container">
        {pokemons.map((pokemon: Pokemon) => (
          <div className="pokemon-card" key={pokemon.name}>
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
