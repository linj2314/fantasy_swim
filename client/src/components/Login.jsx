import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Login() {
    /*
    [form, setForm] = useState({
        user_email: "",
        password: "",
    })
    const params = useParams();
    const navigate = useNavigate();

    async function onSubmit(e) {
        e.preventDefault();
        const user = { ...form };

    }
    */

    return(
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <h3 className="text-lg font-semibold p-4">Login</h3>
                    <form>
                    <div>
                        <label htmlFor="user/email">
                            Username / Email
                        </label>
                    </div>
                    <div className="pb-5">
                        <input type="text" id="user/email" className="rounded-md border-2"/>
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
                        value="Login"
                        className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
                    />
                    </div>
                </form>
            </div>
        </>
    );
}