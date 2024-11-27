import { useParams } from "react-router";
import { PokedexService } from "./services/pokedex-service";
import { useEffect, useState } from "react";
import { Pokemon, Sprite } from "./type";

const PokeDexDetail = () => {
  const { pokemonId } = useParams();

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
    base_experience: 0,
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
    game_indices: [
      {
        game_index: 0,
        version: {
          name: "",
          url: "",
        },
      },
    ],
    height: 0,
    held_items: [], // Replace with specific default values if known
    id: 0,
    is_default: false,
    location_area_encounters: "",
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
    order: 0,
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
    stats: [
      {
        base_stat: 0,
        effort: 0,
        stat: {
          name: "",
          url: "",
        },
      },
    ],
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
  const [isLoading, setIsLoading] = useState(false);
  console.log("pokemonId", pokemonId);
  const pokemonService = PokedexService.getInstance();
  useEffect(() => {
    async function getPokemonDetail() {
      try {
        setIsLoading(true);
        const [res] = await pokemonService.getMultiplePokemonDetails(
          pokemonId as string,
          true
        );

        console.log(res);
        setPokemonDetail(res);
      } catch (err) {
        console.error("failed to fetch pokemon", err);
      } finally {
        setIsLoading(false);
      }
    }
    getPokemonDetail();
  }, []);

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

  if (isLoading) {
    return;
  }

  return (
    <div className="pokemon-card-container">
      <div className="pokemon-card">
        <div className="">
          <div className="">Latest</div>

          <audio controls>
            <source src={pokemonDetail.cries.latest} type="audio/ogg"></source>
            Your browser does not support the audio element.
          </audio>
        </div>

        <div className="">
          <div className="">legacy</div>

          <audio controls>
            <source src={pokemonDetail.cries.legacy} type="audio/ogg"></source>
            Your browser does not support the audio element.
          </audio>
        </div>

        {spritesProps.map((prop) => (
          <img src={pokemonDetail.sprites[prop as Sprite] || ""} alt="" />
        ))}
      </div>

      <div className="">
        {/* pokemon-species api -> flavor text */}

        {/* evolution-chain api ->  */}
      </div>
    </div>
  );
};

export default PokeDexDetail;
