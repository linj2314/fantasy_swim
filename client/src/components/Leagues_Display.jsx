export default function Leagues_Display() {
    const num_windows = [1, 2, 3, 4, 5];

    function League_Window({ league_id }) {
        const creator = "";
        const started_on = "";

        try {
            /*
            const response = await fetch(`http://localhost:5050/league/search?q=${encodeURIComponent(key)}`);

            if (!response.ok) {
                throw new Error("Could not retrieve league");
            }

            const result = await response.json();

            */
        } catch(error) {
            console.error("There was a problem while retrieving leagues", error);
        }

        return(
            <div className="h-full p-4 rounded-lg shadow-lg bg-violet-500 text-center">1</div>
        );
    }

    const windows = num_windows.map(id => <League_Window key={ id } league_id={ id }/>);

    return(
        <>
            <div className="grid grid-cols-3 grid-rows-3 gap-4 p-3 h-screen items-center justify-center">
                {windows}
                {(num_windows.length == 0) ? "When you join/create leagues, they will appear here" : ""}
            </div>
        </>
    );
}