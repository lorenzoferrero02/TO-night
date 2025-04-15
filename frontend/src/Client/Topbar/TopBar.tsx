import './TopBar.css'
import {FC, useState} from "react";
import PersonalArea from "../PersonalArea/PersonalArea.tsx";
import {TopBarI} from "../interfaceClient.ts";


const TopBar: FC<TopBarI> = ({setViewUpdate, setIsLoggedIn }) => {
    const [viewPopUpPA, setViewPopUpPA] = useState(false);
    const onClickPA = () => {
        setViewPopUpPA(true);
    }

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

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }


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
        <section className="topbar">
            <div className={"tonight"} onClick={fetchLogout}></div>
            <div className="topmenu">
                <div className={"personalAreaBtn"} onClick={onClickPA}></div>
            </div>
            {viewPopUpPA && <PersonalArea setViewPopUp={setViewPopUpPA} setViewUpdate={setViewUpdate} ></PersonalArea>}
        </section>
    )
}
export default TopBar