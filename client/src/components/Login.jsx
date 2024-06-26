import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
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
			const response = await fetch("http://localhost:5050/user/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
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
            <div className="flex flex-col items-center justify-center h-screen">
                <h3 className="text-lg font-semibold p-4">Login</h3>
                    <form
                        onSubmit={ onSubmit }
                    >
                    <div>
                        <label htmlFor="user/email">
                            Username / Email
                        </label>
                    </div>
                    <div className="pb-5">
                        <input 
                            type="text" 
                            id="user/email" 
                            className="rounded-md border-2"
                            onChange={(e) => {updateForm({username: e.target.value, email: e.target.value})}}
                        />
                    </div>
                    <div>
                        <label htmlFor="pass">
                            Password
                        </label>
                    </div>
                    <div className="pb-5">
                        <input 
                            type="text" 
                            id="pass" 
                            className="rounded-md border-2"
                            onChange={(e) => {updateForm({password: e.target.value})}}
                        />
                    </div>
                    <div className="flex justify-center">
                    <input 
                        type="submit"
                        value="Login"
                        className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
                    />
                    </div>
                </form>
            </div>
        </>
    );
}