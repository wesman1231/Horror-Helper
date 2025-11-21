import './App.css'
import Header from './UI-Elements/Header';
import Home from "./pages/Home";

import Movies from './pages/movies';
import Television from './pages/television';

import NewReleases from './pages/newReleases';
import ProvenClassics from './pages/provenClassics';
import HiddenGems from './pages/hiddenGems';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />

          {/*header routes*/}
          <Route path="/movies" element={<Movies />} />
          <Route path="/television" element={<Television />} />

          {/*button routes*/}
          <Route path="/new-releases" element={<NewReleases />} />
          <Route path="/proven-classics" element={<ProvenClassics />} />
          <Route path="/hidden-gems" element={<HiddenGems />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
