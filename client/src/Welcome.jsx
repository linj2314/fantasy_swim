import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Welcome = () => {
  document.title = "Welcome - Fantasy Swim"
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-6 bg-[url('./assets/swim_bg.png')] bg-cover">
      <div className="flex flex-col items-center rounded rounded-lg bg-white w-1/6 h-1/4 justify-evenly">
        <div className="text-4xl">
          Fantasy Swim
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <NavLink className="rounded rounded-lg border bg-white p-2 px-4 text-lg hover:bg-slate-100" to="/login">
            Login
          </NavLink>
          <NavLink className="rounded rounded-lg border bg-white p-2 px-4 text-lg hover:bg-slate-100" to="/create_account">
            Create Account
          </NavLink>
        </div>
      </div>
      <div className="flex flex-col rounded rounded-lg fixed bottom-0 right-0 m-4 p-4 bg-blue-500 text-white">
        <span>About the creator</span>
        <div className="flex flex-row justify-center items-center gap-1">
          <a className="p-1" href="https://github.com/linj2314" target="_blank">
            <FontAwesomeIcon className="text-2xl" icon={faGithub} />
          </a>
          <a className="p-1" href="mailto:lanon@umich.edu">
            <FontAwesomeIcon className="text-2xl" icon={faEnvelope} />
          </a>
        </div>
      </div>
    </div>
  );
};
export default Welcome