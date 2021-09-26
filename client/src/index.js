import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {ImageProvider} from "./context/ImageContext";
import {BrowserRouter} from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ImageProvider>
          <App />
        </ImageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

