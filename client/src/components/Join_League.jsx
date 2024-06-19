export default function Join_League({ show, close }) {
    if (!show) {
        return null;
    }

    return(
        <div className="flex h-screen w-screen justify-center items-center fixed">
            <div className="bg-white p-4 rounded shadow-lg flex-row">
                <div className="flex justify-between border-b-2 items-center">
                    <h3 className="text-xl font-semibold p-4">
                        Join League
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
                <div className="pt-5 pb-6">
                    <form className="flex flex-row">
                        <label 
                            htmlFor="input_code"
                            className="pr-10"
                        >
                            Enter Join Code
                        </label>
                        <input 
                            id="input_code"
                            type="text"
                            className="rounded-lg border-2 w-32"
                        />
                    </form>
                </div>
                <div className="flex justify-center items-center">
                    <button className="rounded bg-blue-500 hover:bg-blue-600 text-white p-1 w-24">
                        Join
                    </button>
                </div>
            </div>
        </div>
    );
}