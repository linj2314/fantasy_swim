import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Create_Account() {
    const [form, setForm] = useState({
        email: "",
		username: "",
        password: "",
    });
    const [createAccountError, setCreateAccountError] = useState("");
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
			let response = await fetch("https://fantasy-swim-backend.vercel.app/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});

            if (response.status === 409) {
                const result = await response.json();
                if (result.error === "duplicate_email") {
                    setCreateAccountError("Email is already registered");
                } else {
                    setCreateAccountError("Username is already in use");
                }
                return;
            }

            if (response.status === 400) {
                const result = await response.json();
                if (result.error === "password") {
                    setCreateAccountError("Invalid password");
                } else if (result.error == "invalid_email") {
                    setCreateAccountError("Invalid email");
                } else if (result.error == "missing_field") {
                    setCreateAccountError("At least one field is missing");
                }
                return;
            }

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

            setForm({ email: "", username: "", password: ""});
			navigate("/")
		} catch(error) {
			console.error('A problem occurred adding or updating a record: ', error);
		}
    }

    return(
        <>
            <div className="flex flex-col items-center justify-center h-screen w-screen">
                <h3 className="text-lg font-semibold p-4">Create New Account</h3>
                <form
                    onSubmit={onSubmit}
                    className="flex flex-col items-center justify-center w-48"
                >
                    <div className="w-full">
                        <label htmlFor="email" className="flex justify-start w-full p-2">
                            Email
                        </label>
                    </div>
                    <div className="pb-5">
                        <input 
                            type="text" 
                            id="email" 
                            className="rounded-md border-2"
                            onChange={(e) => {updateForm({email: e.target.value})}}
                            maxLength="30"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="user" className="flex justify-start w-full p-2">
                            Username
                        </label>
                    </div>
                    <div className="pb-5">
                        <input 
                            type="text" 
                            id="user" 
                            className="rounded-md border-2"
                            onChange={(e) => {updateForm({username: e.target.value})}}
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="pass" className="flex justify-start w-full p-2">
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
                    <div className="text-sm pb-5">
                        Password must:
                        <ul style={{ listStyleType: 'disc' }} className="pl-4">
                            <li>be at least 12 characters long</li>
                            <li>contain at least one lowercase, uppercase, special, and digit character</li>
                            <li>not contain any whitespace character</li>
                        </ul>
                    </div>
                    <div className={`h-1/12 flex justify-center items-center ${(!createAccountError) ? "invisible" : "visible"}`}>
                        <span className="bg-red-600 text-white p-2 rounded rounded-lg">
                            {createAccountError}
                        </span>
                    </div>
                    <div className="flex justify-center p-4">
                        <input 
                            type="submit"
                            value="Create New Account"
                            className="p-2 border rounded rounded-lg hover:bg-slate-100 text-lg font-semibold"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}