import { useParams } from "react-router-dom";

export default function Confirm_Delete_League({show, close, league_id}) {
    if (!show) {
        return null;
    }

    const { id } = useParams();

    async function confirm_deletion() {
        try {
            const response = await fetch("http://localhost:5050/league/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    league_id: league_id,
                }),
            });

            if (!response.ok) {
                throw new Error("Server-side error occured while trying to leave/delete league");                
            }
        } catch(error) {
            console.error("Error while trying to leave/delete league", error);
        } finally {
            close();
            window.location.reload();
        }
    }

    return(
        <>
            <div className="h-screen w-screen fixed opacity-25 bg-gray-900 flex items-center justify-center"></div>
            <div className="flex h-screen w-screen justify-center items-center fixed">
                <div className="flex flex-col bg-white p-4 rounded shadow-lg w-2/12 h-4/12 mr-40">
                    <div className="flex flex-row border-b-2 justify-between items-center">
                        <h3 className="text-xl font-semibold p-4">
                            Are you sure?
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
                    <div className="pt-5 pb-4">
                        <form className="flex flex-col">
                            <span className="text-balance">
                                If you are the creator of this league, the entire league will be deleted (this is irreversible). Otherwise, you will leave the league and it will be deleted from your home page.
                            </span>
                        </form>
                    </div>
                    <div className="flex justify-center items-center">
                        <button 
                            className="rounded bg-blue-500 hover:bg-blue-600 text-white p-1 w-24"
                            onClick={confirm_deletion}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}