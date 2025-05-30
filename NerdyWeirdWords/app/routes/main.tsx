import {useEffect,} from "react";
import {useNavigate,} from "react-router";
import {isAuthorized} from "~/util";

export default function Main() {
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const cookieName = "jsonWebToken";
            const target = "/signin";
            const jsonWebToken = document.cookie
                .split("; ")
                .find(item => item.startsWith(`${cookieName}=`))
                ?.split("=")[1];
            if (jsonWebToken) {
                console.log("JWT found in cookie.");
                if (await isAuthorized(jsonWebToken)) {
                    console.log("Valid JWT found in cookie.");
                } else {
                    console.log("Invalid JWT found in cookie.");
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    navigate(target);
                    return;
                }
            } else {
                console.log("JWT not found.");
                navigate(target);
                return;
            }
        })();
    }, [navigate]);

    return <h1>Main</h1>;
}

