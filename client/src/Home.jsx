import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full p-6">
      <div className="flex flex-col items-center justify-center h-screen">
        <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/login">
          Login
        </NavLink>
        <br></br>
        <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/create_account">
          Create Account
        </NavLink>
      </div>
    </div>
  );
};
export default Home