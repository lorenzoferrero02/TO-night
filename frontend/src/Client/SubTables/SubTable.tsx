import './SubTable.css';
import {FC, useEffect, useState} from "react";
import {SubTableI, TableInfoI} from "../interfaceClient.ts";
import './SubTable.css';

const TableInfo: FC<TableInfoI> = ({ setViewPopUp, keyEvento, idTable, numClient, setUpdate}) => {

    const closePopUp = () => {
        setViewPopUp(false);
        setUpdate(true);
    };

    const fetchSubConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            const requestBody = {
                username: token,
                evento: keyEvento,
                idTable: idTable
            };

            const response = await fetch('http://localhost:8080/progetto-tweb/tablesc', {
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
        <div className="bTable" onClick={fetchSubConfirm}>
            <h2> tavolo {idTable} </h2>
            <h3> (persone iscritte: {numClient})</h3>
        </div>
    );
}



const SubTable: FC<SubTableI> = ({setViewPopUp, keyEvento, setUpdate}) => {

    const [tables, setTables] = useState<TableInfoI[]>([]);
    const closePopUp = () => {
        setViewPopUp(false);
    };

    const fetchSubTable = async () => {
        try {
            const response = await fetch('http://localhost:8080/progetto-tweb/tablesc/new/' + keyEvento, {
                method: 'GET',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTables(data);
            } else {
                console.error('Errore nella risposta del server:', response.status);
            }
        } catch (error) {
            console.error('Errore durante il recupero dei dati:', error);
        }
    };

    useEffect(() => {
        fetchSubTable();
    }, []);



    const elems = tables.map((e, index) => (
        <TableInfo
            key={index}
            idTable={e.idTable}
            numClient={e.numClient}
            setViewPopUp = {setViewPopUp}
            keyEvento = {keyEvento}
            setUpdate ={setUpdate}>
        </TableInfo>
    ))

    return (
        <div className={"glasspane"}>
            <div className={"subTable2"}>
                <h1>Seleziona il tavolo a cui vuoi partecipare </h1>
                <div className={"closeButtonT"} onClick={closePopUp}></div>
                <section className={"buttonsTable"}>
                    {elems}
                </section>
            </div>
        </div>

    );
};

export default SubTable;
