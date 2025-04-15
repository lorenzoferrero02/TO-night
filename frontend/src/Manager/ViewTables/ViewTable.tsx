import './ViewTable.css';
import {FC, useEffect, useState} from "react";
import TableDet from "./TableDet/TableDet.tsx";
import {AllTablesI, SingleTableI, ViewTableI} from "../intefaceManager.ts";


const ViewTable: FC<ViewTableI> = ({setViewPopUp, evData}) => {
    const closePopUp = () => {
        setViewPopUp(false);
    };

    const SingleTable:FC<SingleTableI> = ({id, numClient, setViewCountClient})=>{
        const [viewDet, setViewDet] = useState(false);

        const onClickSetViewDet = () => {
            setViewDet(true);
        }
        return (
            <>
            <div className={"bTable"} onClick={onClickSetViewDet}>
                <h2>Tavolo {id}</h2>
                <h3>(persone iscritte: {numClient})</h3>
            </div>
            {viewDet && <TableDet id={id} evData={evData} setViewClientCount={setViewCountClient} setViewDet={setViewDet}/>}
            </>
        )
    }

    const [allTables, setAllTables]= useState<AllTablesI[]>([]);
    const [viewCountClient, setViewCountClient] = useState(false);
    const fetchList = async () => {
        try {
            const response = await fetch('http://localhost:8080/progetto-tweb/tables/all', {
                method: 'GET',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAllTables(data);

            } else {
                console.error('Errore nella risposta del server:', response.status);
            }
        } catch (error) {
            console.error('Errore durante il recupero dei dati:', error);
        }
    };

    useEffect(() => {
        fetchList();
        if(viewCountClient){setViewCountClient(false)}
    }, [viewCountClient]);
    const elems = allTables.filter(e=>e.data===evData).map((e, index)=><SingleTable setViewCountClient={setViewCountClient}
                                                                                    numClient={e.numClient} id={e.id} key={index}></SingleTable>)

    const filteredTables = allTables.filter(e => e.data === evData);
    let clientiTot = 0;

    filteredTables.forEach(table => {
        clientiTot += parseInt( table.numClient);
    });

    return (
        <div className={"glasspane"}>
            <div className={"subTable1"}>
                <div className={"titoloList"}>
                    <h1> Seleziona il tavolo per informazioni</h1>
                    <h3> (iscritti totali: {clientiTot})</h3>
                </div>
                <div className={"bClose"} onClick={closePopUp}></div>
                <section className={"buttonsTable"}>
                    {elems}
                </section>
            </div>
        </div>

    );
};

export default ViewTable;
