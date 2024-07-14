import { useNavigate, Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Join_League from "./Join_League";
import Create_League from "./Create_League";

const Home = () => {
    const navigate = useNavigate();
    const [showCreate, setShowCreate] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
    });
    const home_url = window.location.href;
    let { id } = useParams();

    function updateUserInfo(value) {
		return setUserInfo((prev) => {
			return { ...prev, ...value}
		});
	}

    const open_join_league = () => { 
        navigate("/home/" + id); 
        setShowJoin(true); 
    }
    const close_join_league = () => { setShowJoin(false); }
    const open_create_league = () => { 
        navigate("/home/" + id); 
        setShowCreate(true); 
    }
    const close_create_league = () => { setShowCreate(false); }

    useEffect(() => {
        async function verify() {
            const response = await fetch("http://localhost:5050/user/home", {
                method: "GET",
                headers: {
                    "Authorization": localStorage.getItem("token"),
                },
            });
    
            if (!response.ok) {
                navigate("/");
                return;
            }
    
            const result = await response.json();
            updateUserInfo({ username: result.username, email: result.email, });
            id = result.userId;
            //navigate("/home/" + id);
        }
        
        verify();
    }, []);

    function logout() {
        localStorage.removeItem("token");
        navigate("/")
    }

    return(
        <>
            <Join_League show={showJoin} close={close_join_league}/>
            <Create_League show={showCreate} close={close_create_league}/> 
            <div className="flex flex-row h-screen">
                <div className="flex flex-col basis-1/6 bg-slate-100">
                    <div 
                        className="hover:bg-slate-200 hover:cursor-pointer"
                        onClick={() => navigate("/home/" + id)}
                    >
                        <div className="p-3 text-lg">
                            Home
                        </div>
                    </div>
                    <div 
                        className="hover:bg-slate-200 hover:cursor-pointer"
                        onClick={ open_join_league }    
                    >
                        <div className="p-3 text-lg">
                            Join League
                        </div>
                    </div>
                    <div
                        className="hover:bg-slate-200 hover:cursor-pointer"
                        onClick={ open_create_league }    
                    >
                        <div className="p-3 text-lg">
                            Create League
                        </div>
                    </div>
                    <div className="grow" />
                    <div className="">
                        <div className="pl-3 text-lg font-semibold">
                            {userInfo.username}
                        </div>
                    </div>
                    <div className="p-3 text-lg">
                        {userInfo.email}
                    </div>
                    <div
                        className="hover:bg-red-500 hover:cursor-pointer"
                        onClick={ logout }    
                    >
                        <div className="p-3 text-lg text-red-500 hover:text-white">
                            Log Out
                        </div>
                    </div>
                </div>
                <div className="basis-5/6">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}

export default Home;