import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router, Route,Routes} from "react-router-dom";
import MovieDetails from "./component/MovieDetails";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Router>
           <Routes>
            <Route path={'/'} element={<App/>} />
            <Route path={'/movie/:id'} element={<MovieDetails/>} />
           </Routes>
      </Router>
  </StrictMode>
)
