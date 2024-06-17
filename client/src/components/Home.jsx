import { useNavigate, Outlet } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

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
    }
    
    verify();

    return(
        <>
            <div className="flex flex-row h-screen">
                <div className="flex-col basis-1/6 bg-slate-100 items-center">
                    <div className="hover:bg-slate-200">
                        <div className="p-3 text-lg">
                            Home
                        </div>
                    </div>
                    <div className="hover:bg-slate-200">
                        <div className="p-3 text-lg">
                            Join League
                        </div>
                    </div>
                    <div className="hover:bg-slate-200">
                        <div className="p-3 text-lg">
                            Create League
                        </div>
                    </div>
                    <div className="hover:bg-slate-200">
                        <div className="p-3 text-lg">
                            Settings
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