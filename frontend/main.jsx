import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import QueryProvider from './app/providers/QueryProvider.jsx';
import AuthProvider from './app/providers/AuthProvider.jsx';
import ThemeProvider from './app/providers/ThemeProvider.jsx';
import './styles/globals.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider> 
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
