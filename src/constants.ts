import { Pokemon } from "./type";

export const GENERATIONS = [
  { genId: "all", title: "ALL" },
  { genId: "first", title: "FIRST" },
  { genId: "second", title: "SECOND" },
  { genId: "third", title: "THIRD" },
  { genId: "fourth", title: "FOURTH" },
  { genId: "fifth", title: "FIFTH" },
  { genId: "sixth", title: "SIXTH" },
  { genId: "seventh", title: "SEVENTH" },
  { genId: "eighth", title: "EIGHTH" },
  { genId: "ninth", title: "NINTH" },
];

export const BGM_MAX_NUM_IDX = 45;

export const GEN_GROUPS = {
  all: [1, 1025],
  first: [1, 151],
  second: [152, 251],
  third: [252, 386],
  fourth: [387, 493],
  fifth: [494, 649],
  sixth: [650, 721],
  seventh: [722, 809],
  eighth: [810, 905],
  ninth: [906, 1025],
};

export const MAX_MUSIC_LEN = 5;

export const GEN_ID_KEY = "gen-id-key";

export const INITIAL_POKEMON_STATE: Pokemon = {
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
};
