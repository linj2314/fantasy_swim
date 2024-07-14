import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import score from "./Score.js";

export default function League_View() {
    const { id, league_id } = useParams();
    const [leagueInfo, setLeagueInfo] = useState({});
    const [participants, setParticipants] = useState([]);
    const [swimmers, setSwimmers] = useState([]);
    const [status, setStatus] = useState(-1);
    const [draft, setDraft] = useState(false);
    const [selectedP, setSelectedP] = useState({
        name: "",
        id: "",
    });
    const [draftSelections, setDraftSelections] = useState({});
    const [currentlyChosen, setCurrentlyChosen] = useState([]);
    const [swimmerLookup, setSwimmerLookup] = useState({});
    const [tempPoints, setTempPoints] = useState({});
    const [draftError, setDraftError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

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
                setStatus(result.status);
                setSwimmers(result.swimmers);

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

                const ids = result.participants;
                result = await response.json();
                const temp = result.map((name, index) => ({
                    name: name,
                    id: ids[index],
                }));
                setParticipants(temp);
            } catch(error) {
                console.error("Error while retrieving league information while in league view", error);
            }
        }
        retrieve_info();
    }, []);

    useEffect(() => {
        if (participants.length > 0) {
            setSelectedP(participants[0]);
            const draft_selections = {};
            for (const p of participants) {
                draft_selections[p.id] = [];
            }
            setDraftSelections(draft_selections);
        }
    }, [participants]);

    useEffect(() => {
        if (status == 2) {
            const temp = {};
            for (const [user, drafted] of Object.entries(leagueInfo.draft_selections)) {
                for (const d of drafted) {
                    const swimmer_id = d.link.match(/\d+/g).join('');
                    temp[swimmer_id] = d.name; 
                }
            }
            setSwimmerLookup(temp);
            if (leagueInfo.weekly_results) {
                const temp = {};
                for (const [user, swimmers] of Object.entries(leagueInfo.draft_selections)) {
                    temp[user] = 0;
                    for (const s of swimmers) {
                        const swimmer_id = s.link.match(/\d+/g).join('');
                        for (const [event, results] of Object.entries(leagueInfo.weekly_results)) {
                            if (results[swimmer_id]) {
                                temp[user] += score(event, results[swimmer_id]);
                            }
                        }
                    }
                }
                setTempPoints(temp);
            }
        }
    }, [leagueInfo])
 
    function updateSelectedP(value) {
        setSelectedP(value);
        setCurrentlyChosen(draftSelections[value.id]);
    }

    function make_selection(swimmer) {
        const temp = swimmers.filter((s) => {
            return s.link !== swimmer.link;
        });
        setSwimmers(temp);
        draftSelections[selectedP.id].push(swimmer);
        setCurrentlyChosen(draftSelections[selectedP.id]);
    }

    function remove_selection(swimmer) {
        setSwimmers((prev) => {
            const temp = [...prev, swimmer];

            temp.sort((a, b) => a.name.localeCompare(b.name));

            return temp;
        });
        setDraftSelections((prev) => {
            const temp = prev;
            temp[selectedP.id] = temp[selectedP.id].filter((s) => s.link !== swimmer.link);
            setCurrentlyChosen(temp[selectedP.id]);
            return temp;
        });
    }

    function Event({event, times}) {
        const times_list = [];
        for (const [swimmer, time] of Object.entries(leagueInfo.weekly_results[event])) {
            let drafted_by_you = false;
            for (const s of leagueInfo.draft_selections[id]) {
                if (s.link === "https://www.swimcloud.com/swimmer/" + swimmer) {
                    drafted_by_you = true;
                    break;
                }
            }
            times_list.push(<div key={uuidv4()} className={`flex flex-row w-full p-2 rounded rounded-lg ${(drafted_by_you) ? "bg-blue-300 hover:bg-blue-200": "hover:bg-slate-200"}`}>
                <div className="text-lg w-1/3">
                    {swimmerLookup[swimmer]}
                </div>
                <div className="text-lg w-1/3 text-center">
                    {time}
                </div>
                <div className="text-lg w-1/3 text-end">
                    {score(event, time) == -1 ? "Cannot be scored" : score(event, time)}
                </div>
            </div>)
        }
        return(
            <div className="flex flex-col p-4 border border-slate-300">
                <div className="rounded rounded-lg text-2xl font-semibold p-4 pb-2">
                    {event}
                </div>
                <div className="flex flex-row rounded rounded-lg text-xl font-semibold w-full p-2">
                    <div className="w-1/3">
                        Name
                    </div>
                    <div className="w-1/3 text-center">
                        Time
                    </div>
                    <div className="w-1/3 text-end">
                        Points
                    </div>
                </div>
                {times_list}
            </div>
        )
    }

    const weekly_results = [];
    if (leagueInfo.weekly_results) {
        for (const [event, times] of Object.entries(leagueInfo.weekly_results)) {
            weekly_results.push(<Event key={uuidv4()} event={event} times={times}></Event>);
        }
    }

    function Main_content() {
        if (status == 0) {
            return(
                <div className="basis-1/2 flex flex-col justify-center items-center rounded rounded-lg border border-slate-300 m-4 mx-0">
                    {(id == leagueInfo.creator) && ((participants.length > 1) ? 
                    <button 
                        className="rounded rounded-lg bg-blue-300 hover:bg-blue-200 p-4 text-xl"
                        onClick={() => setDraft(true)}
                    >
                        Start Draft
                    </button> 
                    : 
                    <>
                        <button 
                            className="rounded rounded-lg bg-slate-300 p-4 text-xl"
                        >
                            Start Draft
                        </button>
                        <span className="m-4 px-4 py-2 rounded rounded-lg bg-red-500 text-white">
                            Need more participants to start draft; reload page to show newly joined participants
                        </span>
                    </>
                    )}
                    {(id != leagueInfo.creator) && 
                    <>
                        <button className="rounded rounded-lg bg-slate-300 p-4 text-xl">
                            Start Draft
                        </button>
                        <span className="p-4">
                            Only league creator can start draft!
                        </span>
                    </>
                    }
                    
                    <span className="p-4">
                        Participants will not be able to join or leave after drafting
                    </span>
                </div>
            );
        }
        if (status == 1) {
            return(
                <div className="basis-1/2 flex flex-col justify-center items-center rounded rounded-lg border border-slate-300 m-4 mx-0">
                    <span className="p-4 text-lg">
                        League will begin around the start of the next day (12:00 AM)!
                    </span>
                </div>
            );
        }
        if (status == 2) {
            return(
                <div className="basis-1/2 flex flex-col w-full h-11/12 items-center rounded rounded-lg border border-slate-300 m-4 mx-0">
                    <h3 className="pt-4 text-2xl font-semibold">
                        Weekly Meet Results
                    </h3>
                    <span className="p-2 pb-0">
                        Swimmers/divers in your league are displayed in blue
                    </span>
                    <div className="flex flex-col rounded rounded-lg h-full w-11/12 m-4 grow border border-slate-300 overflow-auto">
                        {weekly_results}
                    </div>
                </div>
            );
        }
        if (status == 3) {
            return(
                <div className="basis-1/2 flex flex-col justify-center items-center rounded rounded-lg border border-slate-300 m-4 mx-0">
                    <span className="p-4 text-lg">
                        This league has concluded and will be auto-deleted 3 days after its conclusion!
                    </span>
                </div>
            );
        }
    }

    function Standing({placing, user, points, temp_points}) {
        let bg_color = "";
        if (placing == 1) {
            bg_color = "bg-[#FFD700]";
        } else if (placing == 2) {
            bg_color = "bg-[#C0C0C0]"
        } else if (placing == 3) {
            bg_color = "bg-[#CD7F32]"
        }
        return(
            <div className={"border border-slate-300 p-4 mx-2 rounded rounded-lg flex flex-row justify-between " + bg_color}>
                <div className="text-xl font-semibold w-1/3">
                    {placing + ". " +  user}
                </div>
                <div className="text-xl font-semibold w-1/3 text-center">
                    {points}
                </div>
                <div className="text-xl font-semibold w-1/3 text-end">
                    {"+ " + Math.round(temp_points * 100) / 100}
                </div>
            </div>
        )
    }

    const standings_results = [];
    if (leagueInfo.points) {
        let index = 1;
        for (const [user, points] of Object.entries(leagueInfo.points)) {
            let name;
            for (const p of participants) {
                if (p.id == user) {
                    name = p.name;
                    break;
                }
            }
            standings_results.push(<Standing key={uuidv4()} placing={index} user={name} points={points} temp_points={tempPoints[user]}></Standing>);
            index++;
        }
    }

    function Standings_content() {
        if (status == 0) {
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
        if (status == 1) {
            return(
                <div className="basis-3/12 flex flex-col rounded rounded-lg border border-slate-300 m-4 justify-start">
                    <div className="basis-6/12 text-xl font-semibold text-center p-4">
                        Standings
                    </div>
                    <div className="flex justify-center">
                        N/A
                    </div>
                </div>
            )
        }
        if (status == 2 || status == 3) {
            return(
                <div className="basis-3/12 flex flex-col rounded rounded-lg border border-slate-300 m-4 justify-start">
                    <div className="text-xl font-semibold text-center p-4">
                        Standings
                    </div>
                    <div className="flex flex-row p-4">
                        <div className="text-xl font-semibold w-1/3">
                            Name
                        </div>
                        <div className="text-xl font-semibold w-1/3 text-center">
                            Points
                        </div>
                        <div className="text-xl font-semibold w-1/3 text-end">
                            Tentative
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {standings_results}
                    </div>
                </div>
            )
        }
    }

    async function submitDraft() {
        if (swimmers.length > 0) {
            setDraftError("Not all swimmers have been drafted yet");
            return;
        }
        try {
            const response = await fetch("http://localhost:5050/league/draft", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    league_id: league_id,
                    draft_selections: draftSelections,
                }),
            });

            if (!response.ok) {
                throw new Error("Error while attempting to store draft results");
            }
        } catch(error) {
            console.error(error);
        } finally {
            setDraft(false);
            setDraftSelections({});
            setCurrentlyChosen([]);
            setSelectedP({});
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
                setStatus(result.status);
            } catch(error) {
                console.error("Error while updating league information after draft completion", error);
            }
        }
    }

    let main_content = <Main_content />;
    let standings_content = <Standings_content />;

    const participants_list = participants.map((item, index) => <div key={uuidv4()} className="rounded rounded-lg text-lg p-2 hover:bg-slate-200 w-full text-center">{(leagueInfo.participants[index] == leagueInfo.creator) ? "👑 " + item.name : item.name}</div>);
    const participants_draft = participants.map((item) => 
    <div 
        key={uuidv4()} 
        className={`rounded rounded-lg text-lg p-2 ${(selectedP.id == item.id) ? 'bg-blue-300' : 'bg-slate-300 hover:bg-slate-200'}`}
        onClick={() => {updateSelectedP(item)}}
    >
        {item.name}
    </div>);
    const selected_draft = currentlyChosen.map((swimmer) => 
    <div 
        key={uuidv4()} 
        className="rounded rounded-lg p-2 bg-slate-300 hover:bg-slate-200 flex flex-row justify-between w-full"
    >
        <h3 className="text-lg w-full">{swimmer.name}</h3>
        <div 
            className="text-lg rounded rounded-lg hover:bg-red-400 hover:cursor-pointer w-6 text-center"
            onClick={() => remove_selection(swimmer)}
        >
            &times;
        </div>
    </div>);
    const swimmers_draft = swimmers.map((swimmer) => 
    <div 
        key={uuidv4()} 
        className="rounded rounded-lg text-lg p-2 bg-slate-300 hover:bg-slate-200 w-full"
        onClick={() => make_selection(swimmer)}
    >
        {swimmer.name}
    </div>);

    async function updateFunc() {
        try {
            const response = await fetch("http://localhost:5050/league/update_results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    league_id: league_id,
                }),
            });

            if (!response.ok) {
                throw new Error("server side error while updating weekly results");
            } else {
                window.location.reload();
            }
        } catch(error) {
            console.error("Error while updating weekly results", error);
        }
    }

    return(
        <>  
            <div className={`flex flex-col h-full w-5/6 fixed ${(draft) ? "visible" : "invisible"}`}>
                <div className="flex flex-row grow justify-evenly h-5/6 w-full">
                    <div className="flex flex-col h-full w-3/12">
                        <h3 className="text-xl font-semibold p-3">Choose a participant to draft for: </h3>
                        <div className="border border-slate-300 h-5/6 p-2 rounded rounded-lg flex flex-col overflow-auto w-full">
                            {participants_draft}
                        </div>
                    </div>
                    <div className="flex flex-col h-full w-3/12">
                        <h3 className="text-xl font-semibold p-3">{`${selectedP.name}\'s drafted swimmers`} </h3>
                        <div className="border border-slate-300 h-5/6 p-2 rounded rounded-lg flex flex-col overflow-auto w-full">
                            {selected_draft}
                        </div>
                    </div>
                    <div className="flex flex-col h-full w-3/12">
                        <h3 className="text-xl font-semibold p-3">Undrafted swimmers </h3>
                        <div className="border border-slate-300 h-5/6 p-2 rounded rounded-lg flex flex-col overflow-auto w-full">
                            {swimmers_draft}
                        </div>
                    </div>
                </div>
                <span className={`mx-4 px-4 py-2 self-end rounded rounded-lg bg-red-500 text-white ${(draftError && draft) ? "visible" : "invisible"}`}>
                    {draftError}
                </span>
                <div className="flex flex-row justify-end p-4">
                    <button 
                        className="flex flex-col items-center justify-center rounded rounded-lg p-4 bg-red-500 mr-4 hover:bg-red-400 hover:cursor-pointer"
                        onClick={() => {
                            setDraft(false); 
                            setDraftError("");
                        }}    
                    >
                        Cancel
                    </button>
                    <button 
                        className="rounded rounded-lg p-4 bg-blue-300 hover:bg-blue-200 hover:cursor-pointer"
                        onClick={submitDraft}
                    >
                        Confirm Selections
                    </button>
                </div>
            </div>
            <div className={`flex flex-col h-full w-5/6 fixed ${(draft) ? "invisible" : "visible"}`}>
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
                            <button onClick={updateFunc}>
                                Update
                            </button>
                        </div>
                    </div>
                    {main_content}
                    {standings_content}
                </div>
            </div>
        </>
    );
}