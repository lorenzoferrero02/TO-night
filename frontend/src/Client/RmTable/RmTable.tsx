import {FC} from "react";
import {RmTableI} from "../interfaceClient.ts";
import './RmTable.css';
const RmTable: FC<RmTableI> = ({keyEvento, setViewUpdate, setViewItems }) => {
    const closePopUp = () => {
        setViewUpdate(true);
        setViewItems(false);
    };

    const fetchRmTable = async () => {
        try {
            const response = await fetch('http://localhost:8080/progetto-tweb/tablesc/' + keyEvento, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });


            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log('Utente rimosso con successo!');
                } else {
                    console.error('Errore durante la rimozione dell\'utente.');
                }
            } else {
                console.error('Errore nella richiesta di rimozione.');
            }
        } catch (error) {
            console.error('Errore durante la richiesta:', error);
        }

        closePopUp();
    };


    return (
        <div className={"bRemoveC"} onClick={fetchRmTable}></div>
    );
};

export default RmTable;
