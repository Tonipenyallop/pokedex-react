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
          data-type={pokemon.types[0].type.name}
          onClick={() => handleCardClicked(pokemon.id)}
        >
          <span className="pokemon-id">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
          <img
            className="pokemon-sprite"
            loading="lazy"
            src={pokemon.sprites.front_default || ""}
            alt={pokemon.name}
          />
          <div className="pokemon-name">{pokemon.name}</div>
          <div className="type-container">
            <span className="type-badge" data-type={pokemon.types[0].type.name}>
              {pokemon.types[0].type.name}
            </span>
            {pokemon.types[1] && (
              <span
                className="type-badge"
                data-type={pokemon.types[1].type.name}
              >
                {pokemon.types[1].type.name}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PokemonCard;
