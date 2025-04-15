import {FC} from "react";
import {RmClientLI} from "../../intefaceManager.ts";
import './RmClientL.css';

const RmClientL: FC<RmClientLI> = ({setViewUpdateM, nomecliente, data})=>{
    const fetchRm = async () => {
        try {
            const requestBody = {
                cliente: nomecliente,
                data: data,
            };

            const response = await fetch('http://localhost:8080/progetto-tweb/evlist', {
                method: 'DELETE',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestBody)
            });


            if (response.ok) {
                const data = await response.json();
                setViewUpdateM(true)
                if (data.rm) {
                    console.log('Rimozione effettuata!');
                } else {
                    console.error('Errore durante la rimozione.');
                }
            } else {
                console.error('Errore nella rimozione.');
            }
        } catch (error) {
            console.error('Errore durante la richiesta:', error);
        }

    };


    return (
        <div className={"bRemove"} onClick={fetchRm}> </div>
    )
}

export default RmClientL