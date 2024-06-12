import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Create_Account() {
    const [form, setForm] = useState({
        email: "",
		username: "",
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
			let response = await fetch("http://localhost:5050/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});
            console.log("sent")

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch(error) {
			console.error('A problem occurred adding or updating a record: ', error);
		} finally {
			setForm({ email: "", username: "", password: ""});
			navigate("/")
		}
    }

    return(
        <>
            <div className="flex flex-col items-center justify-center h-screen">
            <h3 className="text-lg font-semibold p-4">Create New Account</h3>
            <form
                onSubmit={onSubmit}
            >
                <div>
                <label htmlFor="email">
                    Email
                </label>
                </div>
                <div className="pb-5">
                <input 
					type="text" 
					id="email" 
					className="rounded-md border-2"
					onChange={(e) => {updateForm({email: e.target.value})}}
				/>
                </div>
                <div>
                <label htmlFor="user">
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
                <div>
                <label htmlFor="pass">
                    Password
                </label>
                </div>
                <div className="pb-5">
                <input type="text" id="pass" className="rounded-md border-2"/>
                </div>
                <div className="flex justify-center">
                <input 
                    type="submit"
                    value="Create New Account"
                    className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
                />
                </div>
            </form>
            </div>
        </>
    );
}