import {FC} from "react";
import {RmClientTI} from "../../../intefaceManager.ts";


const RmClientT: FC<RmClientTI> = ({setViewUpdateM, nomecliente, data})=>{
    const fetchRm = async () => {
        try {
            const requestBody = {
                cliente: nomecliente,
                data: data,
            };

            const response = await fetch('http://localhost:8080/progetto-tweb/tables/det', {
                method: 'DELETE',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestBody)
            });

            console.log(response.ok);
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

export default RmClientT