import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Loading from "./Loading";
import verify from "./Verify";

export default function Create_League({show, close}) {
    const [name, setName] = useState("");
    const [dur, setDur] = useState("10");
    const [query, setQuery] = useState("");
    const [list, setList] = useState([]);
    const [addedList, setAddedList] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function get_response() {
            if (!query) {
                setList([]);
                return;
            }

            try {
                const response = await fetch("http://localhost:5050/league/api/search/" + query, {
                    method: "GET",
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const filtered = result.filter((obj) => {return(obj.source == "Swimmers" || obj.source == "Teams")});
                setList(filtered);
            } catch(error) {
                console.error("Error occured while fetching data", error);
            }
        }

        get_response();
    }, [query]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
    };

    const enterDur = (event) => {
        if (!event.target.value) {
            setDur("");
            return;
        }
        if (event.target.value < 1) {
            setDur(1);
            return;
        }
        if (event.target.value > 20) {
            setDur(20);
            return;
        }
        setDur(event.target.value);
    }

    function reset_fields() {
        setName("");
        setDur("10");
        setList([]);
        setAddedList([]);
        setQuery("");
    }

    function close_window() {
        reset_fields();
        close();
    }

    async function onSubmit(e) {
        e.preventDefault();
        let id = await verify();

        if (!name) {
            setErrorMessage("Enter a league name");
            return;
        }

        if (addedList.length < 10) {
            setErrorMessage("Add at least 10 swimmers");
            return;
        }

        if (addedList.length > 200) {
            setErrorMessage("Max swimmers allowed is 200");
            return;
        }

        try {
            const response = await fetch("http://localhost:5050/league", {
                method: "POST",
                headers: {
					"Content-Type": "application/json",
				},
                body: JSON.stringify({
                    name: name,
                    duration: dur,
                    swimmers: addedList.map((obj) => ({name: obj.name, link: obj.id})),
                    userId: id,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const league_id = result.id;

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

            if (response2.status == 507) {
                setErrorMessage("Max leagues reached; cannot create new league");
                return;
            }

            if (!response2.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch(error) {
            console.error("An error occured while creating league", error);
        } finally {
            console.log("League Created!")
            close_window();
            reset_fields();
            window.location.reload();
        }
    }

    async function clickDropdown(obj) {
        if (obj.source == "Swimmers") {
            if (addedList.length == 250) {return;}
            let found = false;
            for (const a of addedList) {
                if (obj.id == a.id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                setAddedList((prev) => [...prev, obj]);
            }
        } else {
            setShowLoading(true);
            try {
                const response = await fetch("http://localhost:5050/league/roster/" + obj.url.split("/")[2], {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        max_length: Math.max(0, 250 - addedList.length),
                    }),
                });
                const results = await response.json();
                setAddedList((prev) => [...prev, ...results]);
            } catch(error) {
                console.error(error);
            }
            setShowLoading(false);
        }
        setList([]);
        setQuery("");
    }

    function Dropdown_Item({obj}) {
        return(
            <div 
                className="flex flex-row justify-between w-full p-2 rounded hover:bg-slate-300"
                onClick={() => clickDropdown(obj)}
            >
                <div className="flex flex-col w-10/12">
                    <h3 className="text-lg font-semibold truncate">{obj.name}</h3>
                    <span>{obj.location}</span>
                </div>
                <div>
                    <h3>{obj.source.slice(0, -1)}</h3>
                </div>
            </div>
        );
    }
    
    const dropdown_items = list.map((l) =>
        <Dropdown_Item key={l.id} obj={l}/>
    );

    function Added_Swimmer({obj}) {
        return(
            <>
                <div 
                    className="flex flex-row justify-between w-full p-2 rounded"
                >
                    <div className="flex flex-col w-10/12">
                        <h3 className="text-lg font-semibold truncate">{obj.name}</h3>
                        <span>{obj.location}</span>
                    </div>
                    <div>
                        <button 
                            className="rounded hover:bg-red-500 hover:text-white text-2xl w-6"
                            onClick={() => setAddedList((prev) => 
                                prev.filter((item) => 
                                    item.id != obj.id
                                )
                            )}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            </>
        );
    }

    const added_swimmers = addedList.map((s) =>
        <Added_Swimmer key={ uuidv4() } obj={s}/>
    );
    
    if (!show) {
        return null;
    }

    return(
        <>
            <Loading show={showLoading}/>
            <div className="h-screen w-screen fixed opacity-25 bg-gray-800 flex items-center justify-center"></div>
            <div className="flex h-screen w-screen justify-center items-center fixed">
                <div className="bg-slate-100 p-10 shadow-lg h-screen w-1/3 flex flex-col">
                    <form onSubmit={onSubmit} className="flex flex-col h-full justify-between">
                        <div className="flex flex-col h-5/6">
                            <div className="flex justify-between border-b-2 border-slate-500 p-4">
                                <h3 className="text-3xl font-semibold pr-48">
                                    Create League
                                </h3>
                                <button
                                    onClick={close_window}
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
                                    onKeyDown={handleKeyPress}
                                    maxLength="40"
                                />
                            </div>
                            <div className="flex flex-row p-4 justify-between">
                                <h3 className="text-lg">
                                    Duration of League (Weeks)
                                </h3>
                                <input 
                                    value={dur}
                                    type="number"
                                    className="rounded-lg border border-black w-12"
                                    onChange={enterDur}
                                    onKeyDown={handleKeyPress}
                                />
                            </div>
                            <h3 className="text-lg p-4 pb-0">Add swimmers: </h3>
                            <div className="p-4 flex flex-col justify-center items-center rounded-lg w-full">
                                <div className="w-full relative">
                                    <input 
                                        type="text"
                                        className="p-2 rounded-lg border border-black w-full"
                                        placeholder="Search for swimmers by school, team, name, etc."
                                        onChange={(e)=>{setQuery(e.target.value)}}
                                    />
                                    <div className={`absolute w-full bg-slate-100 rounded rounded-xl ${list.length > 0 ? 'border border-black' : ''}`}>
                                        {dropdown_items}
                                    </div>
                                </div>
                            </div>
                            <ul style={{ listStyleType: 'disc' }} className="px-8">
                                <li>
                                    You may add up to 250 swimmers into the list below, but you can only create a league with 200 swimmers max
                                </li>
                                <li>
                                    Be aware of which teams/swimmers are currently active
                                </li>
                            </ul>
                            <div className="flex flex-col p-4 h-full">
                                <h3 className="text-lg font-semibold">
                                    Added {"(" + addedList.length + ((addedList.length == 250) ? " MAX" : "") + ")"}: 
                                </h3>
                                <div className="h-1/2 overflow-y-auto">
                                    {added_swimmers}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className={`${(errorMessage) ? "visible" : "invisible"} flex justify-center items-center rounded rounded-lg p-1 px-2 bg-red-500 text-white`}>
                                {errorMessage}
                            </span>
                            <input 
                                type="submit"
                                value="Create League"
                                className="p-2 rounded rounded-lg bg-blue-400 text-lg hover:bg-blue-500 hover:text-white"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}