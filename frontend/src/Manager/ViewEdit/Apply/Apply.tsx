import {FC, useState} from "react";
import './Apply.css';
import {ApplyI} from "../../intefaceManager.ts";

const Apply: FC<ApplyI> = ({setViewPopUpE, setViewUpdateM, viewDateForm,
                               name, data, ora, descrizione,
                               prezzolista, prezzotavolo, imageurl})=>{
    const closePopUp = () => {
        setViewPopUpE(false);
    };
    const [viewErr, setViewErr ] = useState(false)
    const fetchAdd = async () => {
        try {
            const token = localStorage.getItem('token');

            const requestBody = {
                username: token,
                nomeevento: name,
                data: data,
                ora: ora,
                descrizione: descrizione,
                prezzotavolo: prezzotavolo,
                prezzolista: prezzolista,
                imageurl: imageurl,
            };

            const response = await fetch('http://localhost:8080/progetto-tweb/events/add', {
                method: 'PUT',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestBody)
            });


            if (response.ok) {
                const data = await response.json();
                setViewUpdateM(true)
                if (data.add) {
                    closePopUp();
                    console.log('Aggiunta effettuata!');
                } else {
                    setViewErr(true)
                    console.error('Errore durante l\'aggiunta.');
                }
            } else {
                console.error('Errore nella aggiunta.');
            }
        } catch (error) {
            console.error('Errore durante la richiesta:', error);
        }


    };


    const fetchEdit = async () => {
        try {
            const requestBody = {
                nomeevento: name,
                data: data,
                ora: ora,
                descrizione: descrizione,
                prezzotavolo: prezzotavolo,
                prezzolista: prezzolista,
                imageurl: imageurl,
            };

            const response = await fetch('http://localhost:8080/progetto-tweb/events/edit', {
                method: 'PUT',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestBody)
            });


            if (response.ok) {
                const data = await response.json();
                setViewUpdateM(true)
                if (data.edit) {
                    console.log('modifica effettuata!');
                } else {
                    console.error('Errore durante la modifica.');
                }
            } else {
                console.error('Errore nella richiesta.');
            }
        } catch (error) {
            console.error('Errore durante la richiesta:', error);
        }

        closePopUp();
    };

    return (
        <>
        {viewDateForm ? (
            <>
                <div className={"apply"} onClick={(e) => { e.preventDefault(); fetchAdd(); }}> Aggiungi </div>
                {viewErr && (
                    <div className={"glasspane"}>
                        <div className={"subTable3"}>
                            <h2> La data è già occupata! </h2>
                            <div className={"ok"} onClick={()=>setViewErr(false)}>ok</div>
                        </div>
                    </div>
                )}
            </>
        )
        : (
            <div className={"apply"} onClick={(e)=> {e.preventDefault();fetchEdit()}}> Modifica </div>)
        }
        </>
    )
}

export default Apply