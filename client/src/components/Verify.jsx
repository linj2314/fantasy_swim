export default async function verify() {
    //const navigate = useNavigate();

    const response = await fetch("http://localhost:5050/user/home", {
        method: "GET",
        headers: {
            "Authorization": localStorage.getItem("token"),
        },
    });

    /*
    if (!response.ok) {
        navigate("/");
    }
    */

    const result = await response.json();
    return result.userId;
}