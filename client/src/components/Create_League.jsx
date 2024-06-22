import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default function Create_League({show, close}) {
    const [name, setName] = useState("");
    const [dur, setDur] = useState("");
    const [query, setQuery] = useState("");
    const [list, setList] = useState([]);
    const [addedList, setAddedList] = useState([]);
    const navigate = useNavigate();
    let id = null;

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

    function reset_fields() {
        setName("");
        setDur("");
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
        try {
            const response = await fetch("http://localhost:5050/league", {
                method: "POST",
                headers: {
					"Content-Type": "application/json",
				},
                body: JSON.stringify({
                    name: name,
                    duration: dur,
                    swimmers: addedList.map((obj) => obj.id),
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
        } catch(error) {
            console.error("An error occured while creating league", error);
        } finally {
            close_window();
            reset_fields();
        }
    }

    function clickDropdown(obj) {
        if (obj.source == "Swimmers") {
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

        }
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
        <div className="flex h-screen w-screen justify-center items-center fixed">
            <div className="bg-slate-100 p-10 shadow-lg h-screen w-1/3 flex flex-col">
                <form onSubmit={onSubmit} className="flex flex-col grow">
                    <div className="flex flex-col grow">
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
                        <div className="flex flex-col p-4">
                            <h3 className="text-lg font-semibold">Added: </h3>
                            <div className="h-96 overflow-y-auto">
                                {added_swimmers}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end">
                        <input 
                            type="submit"
                            value="Create League"
                            className="p-2 rounded rounded-lg bg-blue-400 text-lg hover:bg-blue-500 hover:text-white"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}