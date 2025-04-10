import { PokemonCardProps } from "./type";
import { useNavigate } from "react-router-dom";

const PokemonCard = ({ pokemons }: PokemonCardProps) => {
  const navigate = useNavigate();
  function handleCardClicked(pokemonId: number) {
    navigate(`/detail/${pokemonId.toString()}`);
  }

  return (
    <div className="pokemon-card-container">
      {pokemons.map((pokemon) => (
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

          <img
            loading="lazy"
            src={pokemon.sprites.front_default || ""}
            alt=""
          />
        </div>
      ))}
    </div>
  );
};

export default PokemonCard;
