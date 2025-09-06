import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from "react-redux";
import store from './redux/store.js';
import AllRoutes from './AllRoutes.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AllRoutes />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
