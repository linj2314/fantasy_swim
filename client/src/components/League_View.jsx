import { useParams } from "react-router-dom";

export default function League_View() {
    const { id } = useParams();

    return(
        <>
            <div>
                <div>
                    This is league
                </div>
                <div>
                    {id}
                </div>
            </div>
        </>
    );
}