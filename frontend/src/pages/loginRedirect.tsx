import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

export default function LoginRedirect(){
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    
    function checkAuth(){
        if(!isAuthenticated){
            loginWithRedirect();
        }
        else{
            navigate('/home')
        }
    }

    useEffect(() => {
        checkAuth()
    }, [isAuthenticated]);

    

    return(
        <>
            
        </>
    )
}