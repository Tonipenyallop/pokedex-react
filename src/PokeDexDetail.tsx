import { useNavigate, useParams } from "react-router";
import { pokeDexService } from "./services/pokedex-service";
import { useEffect, useState } from "react";
import {
  GEN_GROUPS,
  GEN_ID_KEY,
  INITIAL_POKEMON_STATE,
  SPRITES_PROPS,
} from "./constants";
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
import { pokeDexDetailHelper } from "./helpers/PokeDexDetail";
import { ChevronIcon } from "./ChevronIcon";

const CryItem = ({ label, src }: { label: string; src: string }) => (
  <div className="cry-item">
    <label className="cry-label">{label}</label>
    <audio controls>
      <source src={src} type="audio/ogg" />
    </audio>
  </div>
);

const SPRITE_LABELS: Record<string, string> = {
  front_default: "Front",
  back_default: "Back",
  front_shiny: "Front Shiny",
  back_shiny: "Back Shiny",
  front_female: "Front Female",
  back_female: "Back Female",
  front_shiny_female: "Front Shiny Female",
  back_shiny_female: "Back Shiny Female",
};

const PokeDexDetail = () => {
  const { pokemonId } = useParams();
  if (!pokemonId) {
    throw new Error("pokemonId from param is empty");
  }

  const [pokemonDetail, setPokemonDetail] = useState<Pokemon>(
    INITIAL_POKEMON_STATE,
  );

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [flavorTexts, setFlavorTexts] = useState<FlavorText[]>([]);
  const [language, setLanguage] = useState<Language>("en");
  const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
  const [evolutionSprites, setEvolutionSprites] = useState<EvolutionChain[]>(
    [],
  );

  useEffect(() => {
    async function getPokemonDetail() {
      try {
        setIsLoading(true);
        const res = await pokeDexService.getPokemonDetails(pokemonId as string);
        const res2 = (await pokeDexService.getEvolutionChainById(
          pokemonId as string,
        )) as SpeciesInfo;

        const set = new Set();
        res2.flavorText.flavor_text_entries.forEach((txt) => {
          set.add(txt.language.name);
        });

        setLanguageOptions(
          (Array.from(set.values()) as string[]).sort((a, b) =>
            a.localeCompare(b),
          ) as Language[],
        );

        setFlavorTexts(res2.flavorText.flavor_text_entries);
        setEvolutionSprites(res2.evolutionChain);

        setPokemonDetail(res);

        await pokeDexDetailHelper.preLoadImages(Object.values(res.sprites));
        const evolutionChainUrls = res2.evolutionChain.map(
          (evolutionChain) => evolutionChain.spriteFront,
        );

        await pokeDexDetailHelper.preLoadImages(evolutionChainUrls);
      } catch (err) {
        console.error("failed to fetch pokemon", err);
      } finally {
        setIsLoading(false);
      }
    }
    getPokemonDetail();
  }, [pokemonId]);

  function handleHome() {
    navigate("/");
  }

  function getGenRange() {
    const genId = localStorage.getItem(GEN_ID_KEY) as GenId;
    if (!genId) {
      throw new Error("genId in localStorage is empty");
    }
    return GEN_GROUPS[genId];
  }

  function handleRightArrow() {
    const genRange = getGenRange();
    let nextIndex = (Number(pokemonId) % genRange[1]) + 1;
    if (nextIndex === 1) {
      nextIndex = genRange[0];
    }
    navigate(`/detail/${nextIndex.toString()}`);
  }

  function handleLeftArrow() {
    const genRange = getGenRange();
    const nextIndex =
      genRange[0] - Number(pokemonId) === 0
        ? genRange[1]
        : Number(pokemonId) - 1;
    navigate(`/detail/${nextIndex.toString()}`);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="detail-page">
      {/* Navigation bar */}
      <nav className="detail-nav">
        <button className="nav-btn" onClick={handleHome} title="Home">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
        <div className="nav-center">
          <button
            className="nav-btn"
            onClick={handleLeftArrow}
            title="Previous"
          >
            <ChevronIcon direction="left" />
          </button>
          <span className="nav-pokemon-id">
            #{String(pokemonId).padStart(3, "0")}
          </span>
          <button className="nav-btn" onClick={handleRightArrow} title="Next">
            <ChevronIcon direction="right" />
          </button>
        </div>
        <div style={{ width: 36 }} />
      </nav>

      <div className="detail-content">
        {/* Hero section */}
        <section className="detail-section detail-hero">
          <img
            className="detail-hero-sprite"
            src={
              pokemonDetail.sprites[
                SPRITES_PROPS[0] as keyof typeof pokemonDetail.sprites
              ] as string
            }
            alt={pokemonDetail.name}
          />
          <h1 className="detail-hero-name">{pokemonDetail.name}</h1>
          <div className="detail-hero-types">
            {pokemonDetail.types.map((t) => (
              <span
                key={t.type.name}
                className="type-badge"
                data-type={t.type.name}
              >
                {t.type.name}
              </span>
            ))}
          </div>
        </section>

        {/* Cries section */}
        <section className="detail-section detail-cries">
          <h2 className="section-title">Cries</h2>
          <div className="cries-grid">
            {pokemonDetail.cries.legacy && (
              <CryItem label="Legacy" src={pokemonDetail.cries.legacy} />
            )}
            <CryItem label="Latest" src={pokemonDetail.cries.latest} />
          </div>
        </section>

        {/* Sprites Gallery */}
        <section className="detail-section detail-sprites">
          <h2 className="section-title">Sprites</h2>
          <div className="sprites-grid">
            {SPRITES_PROPS.map((prop) => {
              const spriteURL = pokemonDetail.sprites[prop as Sprite] || "";
              if (!spriteURL) return null;
              return (
                <div key={prop} className="sprite-item">
                  <img src={spriteURL} alt={`${pokemonDetail.name} ${prop}`} />
                  <span className="sprite-label">
                    {SPRITE_LABELS[prop] || prop}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Evolution Chain */}
        <section className="detail-section detail-evolution">
          <h2 className="section-title">Evolution Chain</h2>
          <div className="evolution-chain">
            {evolutionSprites.map((data, idx) => (
              <div key={data.id} className="evolution-stage-wrapper">
                {idx > 0 && (
                  <ChevronIcon
                    direction="right"
                    className="evolution-arrow"
                    width={24}
                    height={24}
                  />
                )}
                <div
                  className="evolution-stage"
                  onClick={() => navigate(`/detail/${data.id.toString()}`)}
                >
                  <img src={data.spriteFront} alt={data.name} />
                  <span className="evolution-name">{data.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pokedex Entries */}
        <section className="detail-section detail-entries">
          <h2 className="section-title">Pokedex Entries</h2>
          <div className="language-selector">
            {languageOptions.map((label) => (
              <button
                key={label}
                value={label}
                className={`lang-btn${language === label ? " lang-btn--active" : ""}`}
                onClick={() => setLanguage(label)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flavor-text-list">
            {flavorTexts
              .filter((text) => text.language.name === language)
              .map((text, idx) => (
                <div
                  className="flavor-text-card"
                  key={`${text.language.name}-${idx}`}
                >
                  <span className="version-badge">{text.version.name}</span>
                  <p className="flavor-text-content">{text.flavor_text}</p>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PokeDexDetail;
