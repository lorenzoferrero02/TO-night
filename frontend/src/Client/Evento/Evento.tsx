import {FC, useEffect, useState} from 'react';
import './Evento.css';
import SubTable from "../SubTables/SubTable.tsx";
import SubList from "../SubList/SubList.tsx";
import {EventI, MyEventI} from "../interfaceClient.ts";



const EvInfo: FC<MyEventI> = ({ setViewUpdate, nomeEvento, data, ora, descrizione, prezzoTavolo, prezzoLista, style}) => {
    const [showButtons, setShowButtons] = useState(false);
    const [viewPopUp, setViewPopUp] = useState(false);
    const [viewPopUpL, setViewPopUpL] = useState(false);

    const handleMouseEnter = () => {
        setShowButtons(true);
    };

    const handleMouseLeave = () => {
        setShowButtons(false);
    };

    const onClickBTavolo = () => {
        setViewPopUp(true);
    }
    const onClickBList = () => {
        setViewPopUpL(true);
    }


    return (
        <div className="containerC" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={style}>
            <div className={`backgroundC ${showButtons ? 'show' : ''}`}>
                <h1>
                    {nomeEvento} - {data} ({ora})
                </h1>
                <p> {descrizione} </p>
                <h2>
                    PREZZO TAVOLO: {prezzoTavolo}€ <br />
                    PREZZO LISTA: {prezzoLista}€
                </h2>
                <div id="bTavoloC" onClick={(e)=>{
                                            e.stopPropagation();
                                            onClickBTavolo();}}
                >Entra in tavolo</div>
                <div id="bListaC" onClick={(e)=>{
                                            e.stopPropagation();
                                            onClickBList();}}
                >Entra in lista</div>
            </div>
            {viewPopUp && <SubTable setViewPopUp={setViewPopUp} keyEvento={data} setUpdate={setViewUpdate}></SubTable>}
            {viewPopUpL && <SubList setViewPopUpL={setViewPopUpL} keyEvento={data} setUpdate={setViewUpdate}></SubList>}
        </div>
    );
};



const Evento: FC<EventI> = ({viewUpdate, setViewUpdate }) => {
    const [events, setEvents] = useState<MyEventI[]>([]);
    const fetchEvent = async () => {
        try {
            const response = await fetch('http://localhost:8080/progetto-tweb/newevents', {
                method: 'GET',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                console.error('Errore nella risposta del server:', response.status);
            }
        } catch (error) {
            console.error('Errore durante il recupero dei dati:', error);
        }
    };

    useEffect(() => {
        fetchEvent();
        if(viewUpdate){
            setViewUpdate(false);
        }
    }, [viewUpdate]);



    const elems = events
        .slice(0, 3)
        .map((e, index) => (
            <EvInfo
                key={index}
                setViewUpdate= {setViewUpdate}
                nomeEvento={e.nomeEvento}
                data={e.data}
                ora={e.ora}
                descrizione = {e.descrizione}
                prezzoTavolo={e.prezzoTavolo}
                prezzoLista={e.prezzoLista}
                imageUrl={e.imageUrl}
                style={{
                    backgroundImage: `url(${e.imageUrl})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}
             />
        ));

    return <div className={"elemsC"}>
        {elems}
    </div>;
};

export default Evento;
