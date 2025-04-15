import './TopBarManager.css'
import {FC} from "react";
import {TopBarManagerI} from "../intefaceManager.ts";

const TopBarManager: FC<TopBarManagerI> = ({setIsLoggedIn }) => {
    const fetchLogout = async () => {
        try {
            const username = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/progetto-tweb/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json, Authorization',
                },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();
            const success = data.success;
            const errorMessage = data.errorMessage;

            if (success) {
                setIsLoggedIn(false);
                console.log('L\'utente si è disconnesso con successo!')

            } else {
                console.error('Errore durante il logout:', errorMessage);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Errore durante il login:', error);
        }

    };



    return (
        <section className="topbar" onClick={fetchLogout}>
            <div className={"tonight"}></div>
            <div className="topmenu">
            </div>
        </section>
    )
}
export default TopBarManager