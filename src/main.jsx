import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import CreateStock from './components/CreateStock.jsx';
import SectorPage from './components/SectorPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <SectorPage/>,
  },
  {
    path: "/stock/:code",
    element: <App/>,
  },
  {
    path: '/create/stock',
    element: <CreateStock/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
