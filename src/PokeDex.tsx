import { useState, useEffect, useRef } from "react";
import "./PokeDex.css";
import { pokeDexService, PokeDexServiceType } from "./services/pokedex-service";
import { GenId, Pokemon } from "./type";
import { PokeDexHelper } from "./helpers/PokeDex.ts";
import { PokeDexJSXHelper } from "./helpers/PokeDex.tsx";
import PokemonCard from "./PokemonCard.tsx";
import { GEN_ID_KEY, MAX_MUSIC_LEN } from "./constants.ts";
import Loading from "./Loading.tsx";

const PokeDex = () => {
  // pallet town music
  const [musicIndex, setMusicIndex] = useState(0);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // music times
  const [youtubeMusics, setYoutubeMusics] = useState<
    {
      startTime: string;
      name: string;
    }[]
  >([]);

  const [pokemonSelected, setPokemonSelected] = useState(false);

  const playerRef = useRef<YT.Player | null>(null);

  const [pokeDexHelper, setPokeDexHelper] = useState<PokeDexHelper | null>(
    null
  );

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

            setPokeDexHelper(
              new PokeDexHelper({
                setMusicIndex,
                setYoutubeMusics,
                pokeDexService,
                playerRef,
              })
            );
          },
        },
      });
    }, 1000);
  }, [pokeDexHelper]);

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
  function playFromX(event: React.MouseEvent<HTMLButtonElement>) {
    if (!playerRef.current) {
      return;
    }

    const convertedTime = (
      pokeDexHelper as PokeDexHelper
    ).convertMusicStartTime((event.target as HTMLButtonElement).value);

    playerRef.current.seekTo(convertedTime, true);
    playerRef.current.playVideo();
  }

  async function handleNextMusic() {
    if (!playerRef.current) {
      return;
    }
    const nextIndex = (musicIndex + 1) % MAX_MUSIC_LEN;

    playerRef.current.loadPlaylist({
      list: "PL2Hh8Ce3B0ObkyQr65oyCMaqnE6HfqoIg",
      index: nextIndex,
    });
    setMusicIndex(nextIndex);
    const tmp = await pokeDexService.getMusicDescriptionByIndex(
      nextIndex.toString()
    );

    setYoutubeMusics(tmp.musicDescription);
    playerRef.current?.playVideo();
  }

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const genIdInLocalStorage = localStorage.getItem(GEN_ID_KEY);

        const pokemons =
          genIdInLocalStorage && genIdInLocalStorage !== "all"
            ? await pokeDexService.getPokemonsByGen(
                genIdInLocalStorage as GenId
              )
            : await pokeDexService.getAllPokemons();

        setPokemons(pokemons);

        const tmp = await pokeDexService.getMusicDescriptionByIndex(
          musicIndex.toString()
        );
        setYoutubeMusics(tmp.musicDescription);
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
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    const generationId = event.currentTarget.value as GenId | "all";
    let pokemons;
    if (generationId === "all") {
      pokemons = await pokeDexService.getAllPokemons();
    } else {
      pokemons = await pokeDexService.getPokemonsByGen(generationId);
    }

    setPokemons(pokemons);
    localStorage.setItem(GEN_ID_KEY, generationId);
  }

  return (
    <div className="pokedex-container">
      <button
        value={musicIndex}
        onClick={(event) =>
          (pokeDexHelper as PokeDexHelper).handlePrevMusic(event)
        }
      >
        Index MINUS
      </button>
      <div id="player"></div>
      <button onClick={handleNextMusic}>Index PLUS</button>
      {youtubeMusics.length > 0 &&
        youtubeMusics.map((musicObj) => {
          return (
            <button value={musicObj.startTime} onClick={playFromX}>
              {musicObj.name}
            </button>
          );
        })}
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
