import React from "react";
import { GENERATIONS } from "../constants";

export const PokeDexJSXHelper = {
  renderGenerationButton({
    onClick,
    activeGen,
  }: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    activeGen: string;
  }) {
    return Array.from({ length: GENERATIONS.length }, (_, idx) => (
      <button
        key={GENERATIONS[idx].genId}
        value={GENERATIONS[idx].genId}
        onClick={onClick}
        title={GENERATIONS[idx].title}
        className={`gen-button${
          activeGen === GENERATIONS[idx].genId ? " gen-button--active" : ""
        }`}
      >
        {GENERATIONS[idx].title}
      </button>
    ));
  },
};
