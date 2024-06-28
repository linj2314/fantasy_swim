import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Welcome from "./Welcome";
import Login from "./components/Login"
import Create_Account from "./components/Create_Account";
import Home from "./components/Home";
import Error_Page from "./components/Error_Page";
import Leagues_Display from "./components/Leagues_Display";
import League_View from "./components/League_View";
import "./index.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

library.add(faTrashCan);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
    children: [
      /*
      {
        path: "/",
        element: <RecordList />,
      },
      */
    ],
    errorElement: <Error_Page />,
  },
  {
    path: "/login",
    element: <Login />,
    children: [],
  },
  {
    path: "/create_account",
    element: <Create_Account />,
    children: [],
  },
  {
    path: "/home/:id",
    element: <Home />,
    children: [
      {
        path: "/home/:id",
        element: <Leagues_Display />,
      },
      {
        path: "/home/:id/league_view/:league_id",
        element: <League_View />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);