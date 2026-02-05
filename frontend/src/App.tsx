import './App.css'

import Login from './pages/login';
import LoginRedirect from './pages/loginRedirect';
import ForgotPassword from './pages/forgotPassword';

import Header from './UI-Elements/Header';
import Home from "./pages/Home";

import MediaSearch from './pages/mediaSearch';
import MoviePage from './pages/moviePage';
import ShowPage from './pages/showPage';
import Director from './pages/director';

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
          <Route path="/" element={<Login />} />
          <Route path='/login' element={<LoginRedirect />}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/home" element={<Home />}/>

          {/*header routes*/}
          <Route path="/search/:mediaType" element={<MediaSearch />} />

          {/*button routes*/}
          <Route path="/new-releases" element={<NewReleases />} />
          <Route path="/proven-classics" element={<ProvenClassics />} />
          <Route path="/hidden-gems" element={<HiddenGems />} />
          
          {/*media routes*/}
          <Route path='/movies/:id' element={<MoviePage/>}/>
          <Route path='/shows/:id' element={<ShowPage/>}/>
          <Route path='/directors/:directorName' element={<Director />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

