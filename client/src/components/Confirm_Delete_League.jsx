export default function Confirm_Delete_League({show, close}) {
    if (!show) {
        return null;
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
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}