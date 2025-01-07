export type Pokemon = {
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  cries: {
    latest: "";
    legacy: "";
  };
  forms: {
    name: string;
    url: string;
  }[];

  height: number;
  id: number;
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }[];
  }[];
  name: string;
  species: {
    name: string;
    url: string;
  };
  sprites: {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  weight: number;
};

export interface PokemonCardProps {
  pokemons: Pokemon[];
  onClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export type Sprite =
  | "back_default"
  | "back_female"
  | "back_shiny"
  | "back_shiny_female"
  | "front_default"
  | "front_female"
  | "front_shiny"
  | "front_shiny_female";

export type GenId =
  | "first"
  | "second"
  | "third"
  | "fourth"
  | "fifth"
  | "sixth"
  | "seventh"
  | "eighth"
  | "ninth";

type NameAndURL = {
  name: string;
  url: string;
};
export type FlavorText = {
  flavor_text: string;
  language: NameAndURL;
  version: NameAndURL;
};

export type SpeciesInfo = {
  evolutionChain: EvolutionChain[];
  flavorText: { flavor_text_entries: FlavorText[] };
};

export type EvolutionChain = {
  id: string;
  name: string;
  spriteFront: string;
};

export type Language =
  | "en"
  | "fr"
  | "ja-Hrkt"
  | "ko"
  | "de"
  | "es"
  | "it"
  | "ja"
  | "zh-Hant"
  | "zh-Hans";
