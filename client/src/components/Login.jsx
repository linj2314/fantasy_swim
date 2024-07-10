import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();

	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ...value}
		});
	}
	
    async function onSubmit(e) {
        e.preventDefault();
        const user = { ...form };
		try {
			const response = await fetch("https://fantasy-swim-backend-git-master-linj2314s-projects.vercel.app/user/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});

			if (response.status == 401) {
				setLoginError("Invalid username/email or password");
                throw new Error(`HTTP response error while logging in; Status: ${response.status}`);
			}

            const result = await response.json();
            const id = result.userId;
            localStorage.setItem("token", result.token);

            navigate("/home/" + id);
		} catch(error) {
			console.error('A problem while logging in ', error);
		}
    }

    return(
        <>
            <div className="flex flex-col items-center justify-center h-screen w-screen">
                <form
                    onSubmit={ onSubmit }
                    className="flex flex-col items-center justify-center h-full w-48"
                >
                    <h3 className="text-xl font-semibold p-4">Login</h3>
                    <div className="flex items-start w-full">
                        <label htmlFor="user/email" className="text-lg">
                            Username / Email
                        </label>
                    </div>
                    <div className="pb-5 w-full">
                        <input 
                            type="text" 
                            id="user/email" 
                            className="rounded-md border-2 w-full"
                            onChange={(e) => {updateForm({username: e.target.value, email: e.target.value})}}
                            maxLength="30"
                        />
                    </div>
                    <div className="flex items-start w-full">
                        <label htmlFor="pass" className="text-lg">
                            Password
                        </label>
                    </div>
                    <div className="pb-5 w-full">
                        <input 
                            type="text" 
                            id="pass" 
                            className="rounded-md border-2 w-full"
                            onChange={(e) => {updateForm({password: e.target.value})}}
                        />
                    </div>
                    <div className={`h-1/12 flex justify-center items-center ${(!loginError) ? "invisible" : "visible"}`}>
                        <span className="bg-red-600 text-white p-2 rounded rounded-lg">
                            {loginError}
                        </span>
                    </div>
                    <div className="flex justify-center p-4">
                        <input 
                            type="submit"
                            value="Login"
                            className="p-2 border rounded rounded-lg hover:bg-slate-100 text-lg font-semibold"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}