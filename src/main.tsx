import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import PokeDex from "./PokeDex.tsx";
import PokeDexDetail from "./PokeDexDetail.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PokeDex />}></Route>
        <Route path="/detail/:pokemonId" element={<PokeDexDetail />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
