import {FC} from "react";
import '../../ManageEvent/ManageEvent.css';
import {RmEventI} from "../../intefaceManager.ts";



const RmEvent: FC<RmEventI> = ({setViewUpdateM, data})=>{
    const fetchRm = async () => {
        try {
            const requestBody = {
                data: data,
            };

            const response = await fetch('http://localhost:8080/progetto-tweb/events', {
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
        <div id="bRemove" onClick={(e)=>{
            e.stopPropagation();
            fetchRm()
        }}
        >Rimuovi</div>
    )
}

export default RmEvent