import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import verify from "./Verify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Confirm_Delete_League from "./Confirm_Delete_League";

export default function Leagues_Display() {
    const [leagues, setLeagues] = useState([]);
    const { id } = useParams();
    const [showConfirm, setShowConfirm] = useState(false);
    const [leagueId, setLeagueId] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const open_delete_league = () => { setShowConfirm(true); }
    const close_delete_league = () => { setShowConfirm(false); }

    /*
    async function verify() {
        const response = await fetch("https://fantasy-swim-backend.vercel.app/user/home", {
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
            try {
                const response = await fetch("https://fantasy-swim-backend.vercel.app/user/league", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: id,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Error while retrieving user's leagues");
                }

                const result = await response.json();
                setLeagues(result);
            } catch(error) {
                console.log(error);
            }
        }
        get_leagues();
    }, []);

    const delete_league = (e, league_id) => {
        e.stopPropagation();
        setLeagueId(league_id);
        open_delete_league();
    }

    function League_Window({ obj }) {
        const statuses = ["League not yet started", "Drafting", "League in progress", "League finished"];

        return(
            <div 
                className="h-full rounded-lg shadow-lg flex flex-col m-4 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                onClick={() => navigate(`${location.pathname}/league_view/${obj._id}`)}
            >
                <div className="rounded-t-lg bg-slate-200 border-b-2 border-slate-500 p-2 flex flex-row">
                    <div className="grow text-3xl">
                        {obj.name}
                    </div>
                    <div 
                        className="flex rounded rounded-lg bg-red-500 text-white items-center justify-center p-2 px-3 hover:cursor-pointer hover:bg-red-400"
                        onClick={(e) => delete_league(e, obj._id)}
                    >
                        <FontAwesomeIcon icon="fa-trash-can" />
                    </div>
                </div>
                <div className="flex flex-col p-2 grow">
                    {statuses[obj.status]}
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
            <Confirm_Delete_League show={showConfirm} close={close_delete_league} league_id={leagueId}/>
            <div className="grid grid-cols-3 grid-rows-3 gap-4 p-3 h-screen items-center justify-center">
                {windows}
                {leagues.length == 0 && (
                    <div className="col-span-3 row-span-3 flex items-center justify-center">
                        When you join/create leagues, they will appear here
                    </div>
                )}
                {leagues.length == 3 && (
                    <div className="col-span-3 row-span-3 flex items-center justify-center">
                        Note: at this time, you are limited to participating in at most 3 leagues concurrently
                    </div>
                )}
            </div>
        </>
    );
}