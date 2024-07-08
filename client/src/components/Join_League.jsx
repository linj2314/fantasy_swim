import { useState } from "react";
import verify from "./Verify";

export default function Join_League({ show, close }) {
    const [ join, setJoin ] = useState("");
    const [canJoin, setCanJoin] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    if (!show) {
        return null;
    }

    async function join_league() {
        if (!canJoin) {
            return;
        }

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

            if (response.status === 404) {
                let result = await response.json();
                if (result.error === "league_not_found") {
                    setErrorMessage("League not found");
                    return;
                }
            }

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

            setJoin("");
            close();
            window.location.reload();
        } catch(error) {
            console.error(error);
        }
    }

    return(
        <>
            <div className="h-screen w-screen fixed opacity-25 bg-gray-900 flex items-center justify-center"></div>
            <div className="flex h-screen w-screen justify-center items-center fixed">
                <div className="bg-white p-4 rounded shadow-lg">
                    <div className="flex flex-row justify-between border-b-2 items-center">
                        <h3 className="text-xl font-semibold p-4">
                            Join League
                        </h3>
                        <button
                            onClick={() => {
                                close(); 
                                setErrorMessage("");
                            }}
                            className="text-2xl rounded-lg hover:bg-slate-200 w-8 h-8"
                        >
                            <span>
                                &times;
                            </span>
                        </button>
                    </div>
                    <div className="pt-5 pb-4">
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
                                onChange={(e) => { setJoin(e.target.value); 
                                    if (e.target.value.length == 6) {
                                        setCanJoin(true)
                                    } else {
                                        setCanJoin(false)
                                    } }}
                                maxLength="6"
                            />
                        </form>
                    </div>
                    <div className={`flex items-center justify-center pb-4 ${(errorMessage) ? "block" : "hidden"}`}>
                        <span className="rounded rounded-lg bg-red-500 p-1 px-2 text-white">
                            {errorMessage}
                        </span>
                    </div>
                    <div className="flex justify-center items-center">
                        <button 
                            className={`rounded ${(canJoin) ? "bg-blue-500 hover:bg-blue-600" : "bg-slate-300"} text-white p-1 w-24`}
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