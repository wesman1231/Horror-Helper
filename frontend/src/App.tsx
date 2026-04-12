import './App.css'

import LoginRedirect from './pages/loginRedirect';
import ResendEmailVerification from './pages/resendEmailVerification';

import Header from './UI-Elements/Header';
import Home from "./pages/Home";

import MediaSearch from './pages/mediaSearch';
import MoviePage from './pages/moviePage';
import ShowPage from './pages/showPage';
import Director from './pages/director';
import Franchise from './pages/franchise';

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
          {/*auth routes*/}
          <Route path="/" element={<Home />} />
          <Route path='/login' element={<LoginRedirect />}/>
          <Route path="/forgot-password" element={<ResendEmailVerification />} />
          

          {/*header routes*/}
          <Route path="/search/:mediaType" element={<MediaSearch />} />

          {/*button routes*/}
          <Route path="/new-releases" element={<NewReleases />} />
          <Route path="/proven-classics" element={<ProvenClassics />} />
          <Route path="/hidden-gems" element={<HiddenGems />} />
          
          {/*media routes*/}
          <Route path='/movies/:id' element={<MoviePage />} />
          <Route path='/franchises/:franchiseName' element={<Franchise />} />
          <Route path='/shows/:id' element={<ShowPage />} />
          <Route path='/directors/:directorName' element={<Director />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;