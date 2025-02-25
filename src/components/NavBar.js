import { NavLink } from "react-router-dom";


export default function NavBar() {
    return(
        <div className="navBar">
            <NavLink to="/">
            <img src="mySolid-logo.svg" height="322px" width="352px" id="mySolid-logo"/>
            </NavLink>
            <NavLink to="/fileview">Fileview</NavLink>
            <div className="navDivide"></div>
            <div className="loginArea">
                <NavLink to="/login">
                    <button className="loginButton">Log In </button>
                </NavLink>
                <NavLink to="https://solidcommunity.net">
                    <button className="signupButton">Sign Up </button>
                </NavLink>
            </div>
        </div>


    )

}