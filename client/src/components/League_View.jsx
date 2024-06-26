import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default function League_View() {
    const { id, league_id } = useParams();
    const [leagueInfo, setLeagueInfo] = useState({});
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        async function retrieve_info() {
            try {
                let response = await fetch("http://localhost:5050/league/info", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        league_id: league_id,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Error while retrieving league info from backend");
                }

                let result = await response.json();
                setLeagueInfo(result);

                response = await fetch("http://localhost:5050/league/participants", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        participants: result.participants,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Error while retrieving participants username from backend");
                }

                result = await response.json();
                setParticipants(result);
            } catch(error) {
                console.error("Error while retrieving league information while in league view", error);
            }
        }
        retrieve_info();
    }, []);

    function Main_content() {
        if (leagueInfo.status == 0) {
            return(
                <div className="basis-1/2 flex flex-col justify-center items-center rounded rounded-lg border border-slate-300 m-4 mx-0">
                    <button className="rounded rounded-lg bg-blue-300 p-4 text-xl">
                        Start Draft
                    </button>
                    <span className="p-4">
                        Participants will not be able to join or leave after drafting
                    </span>
                </div>
            );
        } else if (leagueInfo.status == 1) {

        }
    }

    function Standings_content() {
        if (leagueInfo.status == 0) {
            return(
                <div className="basis-3/12 flex flex-col rounded rounded-lg border border-slate-300 m-4 justify-start">
                    <div className="basis-6/12 text-xl font-semibold text-center p-4">
                        Standings
                    </div>
                    <div className="flex justify-center">
                        N/A; Finish drafting first
                    </div>
                </div>
            )
        }
    }

    let main_content = <Main_content />;
    let standings_content = <Standings_content />;

    const participants_list = participants.map((username, index) => <div key={uuidv4()} className="text-lg p-2">{(leagueInfo.participants[index] == id) ? "👑 " + username : username}</div>);

    return(
        <>  
            <div className="flex flex-col h-full w-full">
                <div className="basis-1/12 flex items-center justify-center text-3xl font-semibold">
                    {leagueInfo.name}
                </div>
                <div className="flex flex-row h-full w-full">
                    <div className="basis-3/12 flex flex-col justify-start">
                        <div className="basis-1/2 flex flex-col p-4 rounded rounded-lg border border-slate-300 m-4">
                            <div className="text-center text-xl font-semibold p-4 pt-1">
                                Participants
                            </div>
                            <div className="flex flex-col h-full w-full overflow-auto items-center border border-slate-300 rounded rounded-lg">
                                {participants_list}
                            </div>
                        </div>
                        <div className="flex flex-col basis-1/2 rounded rounded-lg border border-slate-300 m-4 mt-0">
                            <div className="flex text-xl font-semibold p-4 justify-center">
                                Settings
                            </div>
                        </div>
                    </div>
                    {main_content}
                    {standings_content}
                </div>
            </div>
            
        </>
    );
}