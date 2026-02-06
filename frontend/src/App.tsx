import './App.css'
import { useAuth0 } from '@auth0/auth0-react';
import type { ReactNode } from 'react';

import Login from './pages/login';
import LoginRedirect from './pages/loginRedirect';
import ResendEmailVerification from './pages/resendEmailVerification';

import Header from './UI-Elements/Header';
import Home from "./pages/Home";

import MediaSearch from './pages/mediaSearch';
import MoviePage from './pages/moviePage';
import ShowPage from './pages/showPage';
import Director from './pages/director';

import NewReleases from './pages/newReleases';
import ProvenClassics from './pages/provenClassics';
import HiddenGems from './pages/hiddenGems';
import { BrowserRouter, Route, Routes, Navigate  } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth0();
  
  if (isLoading) return <div>Loading...</div>;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          {/*auth routes*/}
          <Route path="/" element={<Login />} />
          <Route path='/login' element={<LoginRedirect />}/>
          <Route path="/forgot-password" element={<ResendEmailVerification />} />
          
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }/>

          {/*header routes*/}
          <Route path="/search/:mediaType" element={
            <ProtectedRoute>
              <MediaSearch />
            </ProtectedRoute>
          } />

          {/*button routes*/}
          <Route path="/new-releases" element={
            <ProtectedRoute>
              <NewReleases />
            </ProtectedRoute>
          } />
          <Route path="/proven-classics" element={
            <ProtectedRoute>
              <ProvenClassics />
            </ProtectedRoute>
          } />
          <Route path="/hidden-gems" element={
            <ProtectedRoute>
              <HiddenGems />
            </ProtectedRoute>
          } />
          
          {/*media routes*/}
          <Route path='/movies/:id' element={
            <ProtectedRoute>
              <MoviePage/>
            </ProtectedRoute>
          }/>
          <Route path='/shows/:id' element={
            <ProtectedRoute>
              <ShowPage/>
            </ProtectedRoute>
          }/>
          <Route path='/directors/:directorName' element={
            <ProtectedRoute>
              <Director />
            </ProtectedRoute>
          }></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

