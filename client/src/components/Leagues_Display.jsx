import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import verify from "./Verify"

export default function Leagues_Display() {
    const [leagues, setLeagues] = useState([]);
    const navigate = useNavigate();

    /*
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
        return result.userId;
    }
    */

    useEffect(() => {
        async function get_leagues() {
            const id = await verify();
            try {
                const response = await fetch("http://localhost:5050/user/league", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: id,
                    }),
                });
                const result = await response.json();
                setLeagues(result);
            } catch(error) {
                console.log(error);
            }
        }
        get_leagues();
    }, [])

    function League_Window({ obj }) {
        const statuses = ["League not yet started", "League in progress", "League finished"];

        return(
            <div 
                className="h-full rounded-lg shadow-lg flex flex-col m-4 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                onClick={() => navigate("/home/league_view/" + obj._id)}
            >
                <div className="rounded-t-lg bg-slate-200 border-b-2 border-slate-500 text-3xl p-2">
                    {obj.name}
                </div>
                <div className="flex flex-col p-2 grow">
                    {statuses[obj.started]}
                </div>
                <div className="p-2 text-xl font-semibold">
                    Join Code: {obj.join}
                </div>
            </div>
        );
    }

    const windows = leagues.map(l => <League_Window key={ l._id } obj={ l }/>);

    return(
        <>
            <div className="grid grid-cols-3 grid-rows-3 gap-4 p-3 h-screen items-center justify-center">
                {windows}
                {leagues.length == 0 && (
                    <div className="col-span-3 row-span-3 flex items-center justify-center">
                        When you join/create leagues, they will appear here
                    </div>
                )}
            </div>
        </>
    );
}