import {FC} from "react";
import './SubList.css';
import {SubListI} from "../interfaceClient.ts";


const SubList: FC<SubListI> = ({ setViewPopUpL, keyEvento, setUpdate }) => {
    const closePopUp = () => {
        setViewPopUpL(false);
        setUpdate(true);
    };

    const fetchSubList = async () => {
        try {
            const token = localStorage.getItem('token');
            const requestBody = {
                username: token,
                evento: keyEvento
            };

            const response = await fetch('http://localhost:8080/progetto-tweb/mylists', {
                method: 'PUT',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestBody)
            });


            if (response.ok) {
                const data = await response.json();
                if (data.subscribed) {
                    console.log('Utente iscritto con successo!');
                } else {
                    console.error('Errore durante l\'iscrizione dell\'utente.');
                }
            } else {
                console.error('Errore nella richiesta di iscrizione.');
            }
        } catch (error) {
            console.error('Errore durante la richiesta:', error);
        }

        closePopUp();
    };


    return (
        <div className={"glasspane"}>
            <div className={"subListC"}>
                <h1>Grazie di esserti iscritto!</h1>
                <div className={"ok"} onClick={fetchSubList}>ok</div>
            </div>
        </div>
    );
};

export default SubList;
