import {FC, useEffect, useState} from "react";
import './PersonalArea.css';
import RmTable from "../RmTable/RmTable.tsx";
import RmList from "../RmList/RmList.tsx";
import {MyListI, MyTableI, PersonalAreaI} from "../interfaceClient.ts";



const Mylist: FC<MyListI> = ({nomeEvento, data, ora, setViewUpdate}) => {
    const [viewItems, setViewItems] = useState(true);
    return(
        <>
            {viewItems && <div className={"items"} >
                <div className={"e"} >
                    {nomeEvento}
                </div>
                <div className={"d"} >
                    {data}
                </div>
                <div className={"o"} >
                    {ora}
                </div>
                <RmList keyEvento={data} setViewUpdate={setViewUpdate} setViewItems={setViewItems}></RmList>
            </div>}
        </>
    )
}

const Mytable: FC<MyTableI> = ({nomeEvento, data, ora, idTable, setViewUpdate}) => {
    const [viewItems, setViewItems] = useState(true);
    return(
        <>
            {viewItems && <div className={"itemsT"} >
                <div className={"e"} >
                    {nomeEvento}
                </div>
                <div className={"d"} >
                    {data}
                </div>
                <div className={"o"} >
                    {ora}
                </div>
                <div className={"t"} >
                    {"tavolo" + idTable}
                </div>
                <RmTable keyEvento={data} setViewUpdate={setViewUpdate} setViewItems={setViewItems}></RmTable>
            </div>}
        </>
    )
}


const PersonalArea: FC<PersonalAreaI> = ({setViewPopUp, setViewUpdate}) => {

    const closePopUp = () => {
        setViewPopUp(false);
        setViewUpdate(true);
    };

    /* liste */

    const [list, setList] = useState<MyListI[]>([]);

    const fetchList = async () => {
        try {
            const response = await fetch('http://localhost:8080/progetto-tweb/mylists', {
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
    }, []);

    const elems = list.map((e, index) => (
        <Mylist
            key = {index}
            nomeEvento={e.nomeEvento}
            data={e.data}
            ora={e.ora}
            style={{
                color: 'white'
            }}
            setViewUpdate={setViewUpdate}
        >
        </Mylist>
    ))






    /* tavoli */

    const [table, setTable] = useState<MyTableI[]>([]);

    const fetchTable = async () => {
        try {
            const response = await fetch('http://localhost:8080/progetto-tweb/tablesc/mine', {
                method: 'GET',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTable(data);
                console.log(data);
            } else {
                console.error('Errore nella risposta del server:', response.status);
            }
        } catch (error) {
            console.error('Errore durante il recupero dei dati:', error);
        }
    };

    useEffect(() => {
        fetchTable();
    }, []);

    const tables = table.map((e, index) => (
        <Mytable
            key = {index}
            nomeEvento={e.nomeEvento}
            data={e.data}
            ora={e.ora}
            idTable={e.idTable}
            style={{
                color: 'white'
            }}
            setViewUpdate={setViewUpdate}
        >
        </Mytable>
    ))

    return (
        <div className={"glasspane"}>
            <div className={"personalArea"}>
                <section className={"bar"}>
                    <h1> Benvenuto nella tua area </h1>
                    <div className={"closeButton"} onClick={closePopUp}></div>
                </section>
                <section className={"page"}>
                    <section className={"left"}>
                        <p> In questa sezione troverai tutti gli eventi a cui sei iscritto in lista: </p>
                        <section className={"list"} >
                            {elems}
                        </section>
                    </section>
                    <section className={"right"}>
                        <p> In questa sezione troverai tutti gli eventi a cui sei iscritto in tavolo: </p>
                        <section className={"table"} >
                            {tables}
                        </section>
                    </section>
                </section>
            </div>
        </div>

    );
};

export default PersonalArea;
