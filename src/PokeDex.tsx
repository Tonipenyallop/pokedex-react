import { useState, useEffect, useRef } from "react";
import "./PokeDex.css";
import { PokedexService } from "./services/pokedex-service";
import { GenId, Pokemon } from "./type";
import { PokeDexHelper } from "./helpers/PokeDex.ts";
import { PokeDexJSXHelper } from "./helpers/PokeDex.tsx";
import PokemonCard from "./PokemonCard.tsx";
import { GEN_ID_KEY, MAX_MUSIC_LEN } from "./constants.ts";

const PokeDex = () => {
  // pallet town music
  const [musicIndex, setMusicIndex] = useState(0);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [youtubeMusics, setYoutubeMusics] = useState([]);

  const pokemonService = PokedexService.getInstance();

  const [pokemonSelected, setPokemonSelected] = useState(false);

  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    // race condition?
    setTimeout(() => {
      console.log("onYouTubeIframeAPIReady event");
      new window.YT.Player("player", {
        playerVars: {
          listType: "playlist",
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target; // Fully initialized player
            playerRef.current?.loadPlaylist({
              list: "PL2Hh8Ce3B0ObkyQr65oyCMaqnE6HfqoIg",
              index: musicIndex,
            });
            console.log("playerRef", playerRef);
            console.log("Player ready");
          },
        },
      });
    }, 1000);
  }, []);

  function handlePlayClick() {
    console.log("playerRef.current", playerRef.current);
    if (playerRef.current) {
      playerRef.current.playVideo(); // This actually starts the video
    }
  }

  function stopPlaying() {
    if (playerRef.current) {
      playerRef.current.pauseVideo(); // This actually starts the video
    }
  }
  function playFromX() {
    if (playerRef.current) {
      playerRef.current.seekTo(60, true); // This actually starts the video
      playerRef.current.playVideo(); // This actually starts the video
    }
  }

  function handleNextMusic() {
    if (!playerRef.current) {
      return;
    }
    const nextIndex = (musicIndex + 1) % MAX_MUSIC_LEN;
    playerRef.current.loadPlaylist({
      list: "PL2Hh8Ce3B0ObkyQr65oyCMaqnE6HfqoIg",
      index: nextIndex,
    });
    setMusicIndex(nextIndex);
    playerRef.current?.playVideo();
  }

  function handlePrevMusic() {
    if (!playerRef.current) {
      return;
    }
    const prevIndex = musicIndex <= 0 ? MAX_MUSIC_LEN - 1 : musicIndex - 1;
    playerRef.current.loadPlaylist({
      list: "PL2Hh8Ce3B0ObkyQr65oyCMaqnE6HfqoIg",
      index: prevIndex,
    });
    setMusicIndex(prevIndex);
    playerRef.current?.playVideo();
  }

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

        // if i add below cannot render box
        // get music
        const tmp = await pokemonService.getAllPokemonBGMs();
        console.log("tmp", tmp);
        setYoutubeMusics(tmp);
        // setYoutubeMusics(tmp.musicDescription);
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
      <button onClick={handlePrevMusic}>Index MINUS</button>
      <div id="player"></div>
      <button onClick={handleNextMusic}>Index PLUS</button>

      <button onClick={playFromX}>XX</button>

      <button onClick={handlePlayClick}>play</button>
      <button onClick={stopPlaying}>stop</button>
      <div className="">
        <div className="generation-button-container">
          {PokeDexJSXHelper.renderGenerationButton({
            onClick: handleGenButtonClick,
          })}
        </div>

        <PokemonCard pokemons={pokemons} onClick={setPokemonSelected} />
      </div>
    </div>
  );
};

export default PokeDex;
