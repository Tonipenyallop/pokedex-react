import { useNavigate, useParams } from "react-router";
import { pokeDexService } from "./services/pokedex-service";
import { useEffect, useState } from "react";
import { GEN_GROUPS, GEN_ID_KEY, INITIAL_POKEMON_STATE } from "./constants";
import Loading from "./Loading";
import {
  GenId,
  Pokemon,
  Sprite,
  SpeciesInfo,
  Language,
  FlavorText,
  EvolutionChain,
} from "./type";

const PokeDexDetail = () => {
  const { pokemonId } = useParams();
  if (!pokemonId) {
    throw new Error("pokemonId from param is empty");
  }

  const [pokemonDetail, setPokemonDetail] = useState<Pokemon>(
    INITIAL_POKEMON_STATE
  );

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [flavorTexts, setFlavorTexts] = useState<FlavorText[]>([]);
  // en ja ko
  const [language, setLanguage] = useState<Language>("en");
  const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
  const [evolutionSprites, setEvolutionSprites] = useState<EvolutionChain[]>(
    []
  );

  useEffect(() => {
    async function getPokemonDetail() {
      try {
        setIsLoading(true);
        const res = await pokeDexService.getPokemonDetails(pokemonId as string);
        const res2 = (await pokeDexService.getEvolutionChainById(
          pokemonId as string
        )) as SpeciesInfo;

        const set = new Set();
        res2.flavorText.flavor_text_entries.forEach((txt) => {
          set.add(txt.language.name);
        });
        setLanguageOptions(Array.from(set.values()) as Language[]);

        setFlavorTexts(res2.flavorText.flavor_text_entries);
        setEvolutionSprites(res2.evolutionChain);

        setPokemonDetail(res);

        await getPokemonSprites(res.sprites);
      } catch (err) {
        console.error("failed to fetch pokemon", err);
      } finally {
        setIsLoading(false);
      }
    }
    getPokemonDetail();
  }, [pokemonId]);

  const spritesProps = [
    "front_default",
    "back_default",
    "front_shiny",
    "back_shiny",
    "front_female",
    "back_female",
    "front_shiny_female",
    "back_shiny_female",
  ];

  // pre-load pokemon sprite
  async function getPokemonSprites(sprites: Record<string, string | null>) {
    const promises = Object.values(sprites)
      .filter((prop) => prop !== null)
      .map((prop) => {
        const image = new Image();
        image.src = prop as string;

        return new Promise((resolve) => {
          image.onload = resolve;
          image.onerror = resolve;
        });
      });

    await Promise.all(promises);
  }

  // pre-load evolution chain

  function handleHome() {
    navigate("/");
  }

  function handleRightArrow() {
    console.log("handleLeftArrow was called");
    const genId = localStorage.getItem(GEN_ID_KEY) as GenId;
    if (!genId) {
      throw new Error("genId in localStorage is empty");
    }
    const genRange = GEN_GROUPS[genId];

    let nextIndex = (Number(pokemonId) % genRange[1]) + 1;
    // to prevent last pokemon of a gen to bulbasour
    if (nextIndex === 1) {
      nextIndex = genRange[0];
    }

    navigate(`/detail/${nextIndex.toString()}`);
  }

  function handleLeftArrow() {
    console.log("handleLeftArrow was called");
    const genId = localStorage.getItem(GEN_ID_KEY) as GenId;
    if (!genId) {
      throw new Error("genId in localStorage is empty");
    }
    const genRange = GEN_GROUPS[genId];
    const nextIndex =
      genRange[0] - Number(pokemonId) === 0
        ? genRange[1]
        : Number(pokemonId) - 1;

    console.log(nextIndex);
    navigate(`/detail/${nextIndex.toString()}`);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="poke-dex-detail-container">
      <button onClick={handleHome}>HOME</button>
      <div className="poke-dex-detail-card-container">
        <button onClick={handleLeftArrow}>Arrow Left</button>
        <div className="pokemon-card detail-page">
          <div className="detail-audio-container">
            <div className="">
              <div className="">Latest</div>

              <audio controls>
                <source
                  src={pokemonDetail.cries.latest}
                  type="audio/ogg"
                ></source>
                Your browser does not support the audio element.
              </audio>
            </div>

            <div className="">
              <div className="">legacy</div>

              <audio controls>
                <source
                  src={pokemonDetail.cries.legacy}
                  type="audio/ogg"
                ></source>
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
          <div className="">
            {spritesProps.map((prop) => {
              const spriteURL = pokemonDetail.sprites[prop as Sprite] || "";
              if (!spriteURL) {
                return null;
              }
              return <img src={spriteURL} alt="" />;
            })}
          </div>

          <p>EVOLUTION CHAIN</p>
          <div className="evolution-chain">
            {evolutionSprites.map((data) => (
              <div className="">
                <img className="" src={data.spriteFront}></img>
                <p className="evolution-chain-name">{data.name}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleRightArrow}>Arrow Right</button>
      </div>
      <div className="language-container">
        {languageOptions.map((label) => (
          <button
            value={label}
            onClick={(e) => {
              console.log("e.target", e.target.value);
              setLanguage(e.target.value);
            }}
          >
            {label}/{}
          </button>
        ))}
      </div>
      <div className="flavor-text-container">
        {/* pokemon-species api -> flavor text */}

        {flavorTexts
          .filter((text) => text.language.name === language)
          .map((text) => (
            <div className="flavor-text">
              <div className="version-name">{text.version.name}</div>
              <div className="">{text.flavor_text}</div>
            </div>
          ))}

        {/* evolution-chain api ->  */}
      </div>
    </div>
  );
};

export default PokeDexDetail;
