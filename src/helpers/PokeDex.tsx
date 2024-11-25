import React from "react";
import { GENERATIONS } from "../constants";
export const PokeDexJSXHelper = {
  renderGenerationButton({
    onClick,
  }: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  }) {
    return Array.from({ length: GENERATIONS.length }, (_, idx) => (
      <button
        key={GENERATIONS[idx].genId}
        value={GENERATIONS[idx].genId}
        onClick={onClick}
        title={GENERATIONS[idx].title}
      >
        {GENERATIONS[idx].title}
      </button>
    ));
  },
};
