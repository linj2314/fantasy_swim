import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./Home";
import Login from "./components/Login"
import Create_Account from "./components/Create_Account";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      /*
      {
        path: "/",
        element: <RecordList />,
      },
      */
    ],
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
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);