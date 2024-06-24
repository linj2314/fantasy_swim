import { useState } from "react";
import verify from "./Verify";

export default function Join_League({ show, close }) {
    const [ join, setJoin ] = useState("");

    if (!show) {
        return null;
    }

    async function join_league() {
        let id = await verify();

        try {
            let response = await fetch("http://localhost:5050/league/participant", {
                method: "POST",
                headers: {
					"Content-Type": "application/json",
				},
                body: JSON.stringify({
                    join: join,
                    id: id
                }),
            });
            let result = await response.json();
            const league_id = result.league_id;

            if (!response.ok) {
                throw new Error("error occured while attempting to join league");
            }

            response = await fetch("http://localhost:5050/user/league", {
                method: "PATCH",
                headers: {
					"Content-Type": "application/json",
				},
                body: JSON.stringify({
                    id: id,
                    league_id: league_id,
                }),
            });

            if (!response.ok) {
                throw new Error("error occured while attempting to join league");
            }
        } catch(error) {
            console.error(error);
        } finally {
            setJoin("");
            close();
            window.location.reload();
        }
    }

    return(
        <>
            <div className="h-screen w-screen fixed opacity-25 bg-gray-900 flex items-center justify-center"></div>
            <div className="flex h-screen w-screen justify-center items-center fixed">
                <div className="bg-white p-4 rounded shadow-lg flex-row">
                    <div className="flex justify-between border-b-2 items-center">
                        <h3 className="text-xl font-semibold p-4">
                            Join League
                        </h3>
                        <button
                            onClick={close}
                            className="text-2xl rounded-lg hover:bg-slate-200 w-8 h-8"
                        >
                            <span>
                                &times;
                            </span>
                        </button>
                    </div>
                    <div className="pt-5 pb-6">
                        <form className="flex flex-row">
                            <label 
                                htmlFor="input_code"
                                className="pr-10"
                            >
                                Enter Join Code
                            </label>
                            <input 
                                id="input_code"
                                type="text"
                                className="rounded-lg border-2 w-32"
                                onChange={(e) => { setJoin(e.target.value) }}
                            />
                        </form>
                    </div>
                    <div className="flex justify-center items-center">
                        <button 
                            className="rounded bg-blue-500 hover:bg-blue-600 text-white p-1 w-24"
                            onClick={join_league}
                        >
                            Join
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}