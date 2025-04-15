import {FC, useEffect, useState} from "react";
import RmCientT from "./RmClientT/RmCientT.tsx";
import './TableDet.css'
import {InTableI, MembersI, TableDetI} from "../../intefaceManager.ts";

const TableDet: FC<TableDetI> = ({id, setViewDet, evData, setViewClientCount}) => {
    const Members:FC<MembersI> =({member, setViewMemberUpdate})=>{

        return (
            <div>
                <div className={"member"}>
                     <h2> {member} </h2>
                    <RmCientT nomecliente={member} data={evData} setViewUpdateM={setViewMemberUpdate}></RmCientT>
                </div>
            </div>

        )
    }

    const onClickCloseDet = () => {
        setViewDet(false);
    };

    const [inTable, setInTable]=useState<InTableI[]>([]);

    const [viewMemberUpdate, setViewMemberUpdate] = useState(false)

    const fetchList = async () => {
        try {
            const response = await fetch('http://localhost:8080/progetto-tweb/tables/det/' + id +'/'+ evData,  {
                method: 'GET',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setInTable(data);
            } else {
                console.error('Errore nella risposta del server:', response.status);
            }
        } catch (error) {
            console.error('Errore durante il recupero dei dati:', error);
        }
    };

    useEffect(() => {
        fetchList();
        if(viewMemberUpdate){setViewMemberUpdate(false); setViewClientCount(true)}
    }, [viewMemberUpdate]);

    const list = inTable.map((e,index)=><Members key={index} member={e.nomecliente} setViewMemberUpdate={setViewMemberUpdate}></Members>)

    return (
        <div className={"glasspane"}>
            <div className={"subTable"}>
                <h1> Tavolo {id} </h1>
                <div className={"members"}>{list}</div>
                <div className={"bClose"} onClick={onClickCloseDet}></div>
            </div>
        </div>
    )

}
export default TableDet