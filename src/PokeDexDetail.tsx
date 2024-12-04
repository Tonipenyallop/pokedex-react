import { useNavigate, useParams } from "react-router";
import { PokedexService } from "./services/pokedex-service";
import { useEffect, useState } from "react";
import { GEN_GROUPS, GEN_ID_KEY } from "./constants";
import {
  GenId,
  Pokemon,
  Sprite,
  SpeciesInfo,
  Language,
  FlavorText,
} from "./type";

const PokeDexDetail = () => {
  const { pokemonId } = useParams();
  if (!pokemonId) {
    throw new Error("pokemonId from param is empty");
  }

  //   Can we do better?
  const [pokemonDetail, setPokemonDetail] = useState<Pokemon>({
    abilities: [
      {
        ability: {
          name: "",
          url: "",
        },
        is_hidden: false,
        slot: 0,
      },
    ],
    cries: {
      latest: "",
      legacy: "",
    },
    forms: [
      {
        name: "",
        url: "",
      },
    ],
    height: 0,
    id: 0,
    moves: [
      {
        move: {
          name: "",
          url: "",
        },
        version_group_details: [
          {
            level_learned_at: 0,
            move_learn_method: {
              name: "",
              url: "",
            },
            version_group: {
              name: "",
              url: "",
            },
          },
        ],
      },
    ],
    name: "",
    species: {
      name: "",
      url: "",
    },
    sprites: {
      back_default: null,
      back_female: null,
      back_shiny: null,
      back_shiny_female: null,
      front_default: null,
      front_female: null,
      front_shiny: null,
      front_shiny_female: null,
    },
    types: [
      {
        slot: 0,
        type: {
          name: "",
          url: "",
        },
      },
    ],
    weight: 0,
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [flavorTexts, setFlavorTexts] = useState<FlavorText[]>([]);
  // en ja ko
  const [language, setLanguage] = useState<Language>("en");
  const [languageOptions, setLanguageOptions] = useState<Language[]>([]);

  const pokemonService = PokedexService.getInstance();
  useEffect(() => {
    async function getPokemonDetail() {
      try {
        setIsLoading(true);
        const res = await pokemonService.getPokemonDetails(pokemonId as string);
        const res2 = (await pokemonService.getEvolutionChainById(
          pokemonId as string
        )) as SpeciesInfo;

        const set = new Set();
        res2.flavor_text_entries.forEach((txt) => {
          set.add(txt.language.name);
        });
        setLanguageOptions(Array.from(set.values()) as Language[]);

        console.log(set);
        console.log(res2.flavor_text_entries);

        setFlavorTexts(res2.flavor_text_entries);

        console.log(res);
        setPokemonDetail(res);
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

    const nextIndex = (Number(pokemonId) + 1) % genRange[1];

    console.log(nextIndex);
    navigate(`/detail/${nextIndex.toString()}`);
  }
  function handleLeftArrow() {
    console.log("handleLeftArrow was called");
    const genId = localStorage.getItem(GEN_ID_KEY) as GenId;
    if (!genId) {
      throw new Error("genId in localStorage is empty");
    }
    const genRange = GEN_GROUPS[genId];
    console.log("genRange", genRange);
    const nextIndex =
      genRange[0] - Number(pokemonId) === 0
        ? genRange[1]
        : Number(pokemonId) - 1;

    console.log(nextIndex);
    navigate(`/detail/${nextIndex.toString()}`);
  }

  if (isLoading) {
    return;
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
            {spritesProps.map((prop) => (
              <img src={pokemonDetail.sprites[prop as Sprite] || ""} alt="" />
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
