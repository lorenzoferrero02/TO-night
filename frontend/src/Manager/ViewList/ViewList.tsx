import {FC, useEffect, useState} from "react";
import './ViewList.css'
import RmClientL from "./RmClientL/RmClientL.tsx";
import {ListEvI, ViewListI} from "../intefaceManager.ts";

const ViewList: FC<ViewListI> = ({setViewPopUpL, evData}) => {

    const closePopUp = () => {
        setViewPopUpL(false);
    };

    const ListEv: FC<ListEvI> = ({nomecliente}) =>{

        return (
            <div>
                 <div className={"member"}>
                    <h2> {nomecliente} </h2>
                    <RmClientL nomecliente={nomecliente} data={evData} setViewUpdateM={setViewMemberUpdate}></RmClientL>
                </div>
            </div>
        )

    }

    const [list, setList]= useState<ListEvI[]>([]);
    const [viewMemberUpdate, setViewMemberUpdate] = useState(false)
    const fetchList = async () => {
        try {
            const response = await fetch('http://localhost:8080/progetto-tweb/evlist', {
                method: 'GET',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setList(data);

            } else {
                console.error('Errore nella risposta del server:', response.status);
            }
        } catch (error) {
            console.error('Errore durante il recupero dei dati:', error);
        }
    };

    useEffect(() => {
        fetchList();
        if(viewMemberUpdate){setViewMemberUpdate(false)}
    }, [viewMemberUpdate]);

    const elems = list.filter(e => e.data==evData).map((e, index)=>
        <ListEv key={index} nomecliente={e.nomecliente} data={e.data} nomelista={e.nomelista} ></ListEv>)

    let clientiTot = 0;

    elems.forEach(() => {
        clientiTot++;
    });

    return (
        <div className={"glasspane"}>
            <div className={"subList"}>
                <div className={"titoloList"}>
                    <h1> Partecipanti </h1>
                    <h3> (iscritti totali: {clientiTot})</h3>
                </div>
                <div className={"members"}>{elems}</div>
                <div className={"bClose"} onClick={closePopUp}></div>
            </div>
        </div>

    );
};

export default ViewList;
