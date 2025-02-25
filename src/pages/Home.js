import logo from '../logo.svg';
import { NavLink } from "react-router-dom";

import {
    LoginButton,
    Text,
    Value,
    useSession,
    CombinedDataProvider,
    useDataset
  } from "@inrupt/solid-ui-react";
  
  
export default function Home() {
const {
    session,
    sessionRequestInProgress,
    fetch,
    login,
    logout,
} = useSession();

return (<>
    {console.log(session)}
    <div className="mainScreen max-w-4xl flex-1">
    <h1>test!</h1>
    <NavLink to="/login"> <button className="loginButton">Log In</button></NavLink>
    </div>
    </>
);
}