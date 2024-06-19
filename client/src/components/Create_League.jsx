import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Create_League({show, close}) {
    if (!show) {
        return null;
    }

    const [name, setName] = useState("");
    const [dur, setDur] = useState("");
    const navigate = useNavigate();
    let id = null;

    async function verify() {
        const response = await fetch("http://localhost:5050/user/home", {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("token"),
            },
        });

        if (!response.ok) {
            navigate("/");
        }

        const result = await response.json();
        id = result.userId;
    }
    
    verify();

    async function onSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5050/league", {
                method: "POST",
                headers: {
					"Content-Type": "application/json",
				},
                body: JSON.stringify({
                    name: name,
                    duration: dur,
                    swimmers: [],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const league_id = result.id;

            if (!id) {
                verify();
            }

            const response2 = await fetch("http://localhost:5050/user/league", {
                method: "PATCH",
                headers: {
					"Content-Type": "application/json",
				},
                body: JSON.stringify({
                    id: id,
                    league_id: league_id,
                }),
            });

            if (!response2.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            navigate("/home");
        } catch(error) {
            console.error("An error occured while creating league", error);
        }
    }

    return(
        <div className="flex h-screen w-screen justify-center items-center fixed">
            <div className="bg-slate-100 p-10 shadow-lg h-screen flex flex-col">
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col grow">
                        <div className="flex justify-between border-b-2 border-slate-500 p-4">
                            <h3 className="text-3xl font-semibold pr-48">
                                Create League
                            </h3>
                            <button
                                onClick={close}
                                className="text-3xl rounded-lg hover:bg-slate-200 w-8 h-8"
                            >
                                <span>
                                    &times;
                                </span>
                            </button>
                        </div>
                        <div className="flex flex-row p-4 justify-between">
                            <h3 className="text-lg">
                                League Name
                            </h3>
                            <input 
                                type="text"
                                className="rounded-lg border border-black w-64"
                                onChange={(e)=>{setName(e.target.value)}}
                            />
                        </div>
                        <div className="flex flex-row p-4 justify-between">
                            <h3 className="text-lg">
                                Duration of League (days)
                            </h3>
                            <input 
                                type="number"
                                className="rounded-lg border border-black w-12"
                                onChange={(e)=>{setDur(e.target.value)}}
                            />
                        </div>
                        <div className="p-4 flex justify-center items-center">
                            <input 
                                className="p-2 rounded-lg border border-black w-full"
                                placeholder="Search for swimmers by school, team, name, etc."
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-end">
                        <button 
                            className="rounded-lg p-4 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Create League
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}