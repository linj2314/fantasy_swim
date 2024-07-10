export default async function verify() {
    //const navigate = useNavigate();

    const response = await fetch("https://fantasy-swim-backend-git-master-linj2314s-projects.vercel.app/user/home", {
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