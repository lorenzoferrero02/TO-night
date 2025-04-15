import {FC, useEffect, useState} from 'react';
import './ManageEvent.css';
import ViewList from "../ViewList/ViewList.tsx";
import ViewTable from "../ViewTables/ViewTable.tsx";
import ViewEdit from '../ViewEdit/ViewEdit.tsx';
import RmEvent from "./RmEvent/RmEvent.tsx";
import {EventoI, EventoInfoI} from "../intefaceManager.ts";




const EvInfo: FC<EventoInfoI> = ({ setViewUpdateM, nomeEvento, data, style, imageurl, ora, descrizione, prezzolista,
                                     prezzotavolo}) => {
    const [showButtons, setShowButtons] = useState(false);
    const [viewPopUp, setViewPopUp] = useState(false);
    const [viewPopUpL, setViewPopUpL] = useState(false);
    const [viewPopUpE, setViewPopUpE] = useState(false);

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
    const onClickBEdit = () => {
        setViewPopUpE(true);
    }


    return (
        <div className="container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={style}>
            <div className={`background ${showButtons ? 'show' : ''}`}>
                <h1>
                    {nomeEvento} - {data} ({ora})
                </h1>
                <div id="bTavolo" onClick={(e)=>{
                                            e.stopPropagation();
                                            onClickBTavolo();}}
                >Dettagli tavoli</div>
                <div id="bLista" onClick={(e)=>{
                                                e.stopPropagation();
                                                onClickBList();}}
                >Dettagli lista</div>
                <div id="bEdit" onClick={(e)=>{
                                                e.stopPropagation();
                                                onClickBEdit();}}
                >Modifica</div>
                <RmEvent data={data}  setViewUpdateM={setViewUpdateM}></RmEvent>
            </div>
            {viewPopUp && <ViewTable setViewPopUp={setViewPopUp} evData={data}></ViewTable>}
            {viewPopUpL && <ViewList setViewPopUpL={setViewPopUpL} evData={data}></ViewList>}
            {viewPopUpE && <ViewEdit  setViewUpdateM={setViewUpdateM} setViewPopUpE={setViewPopUpE} data={data} name={nomeEvento} ora={ora}
                                      imageurl={imageurl} descrizione={descrizione} prezzolista={prezzolista} prezzotavolo={prezzotavolo}></ViewEdit>}
        </div>
    );
};



const ManageEvent: FC = () => {
    const [events, setEvents] = useState<EventoI[]>([]);

    const [viewUpdateM, setViewUpdateM] = useState(false);
    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:8080/progetto-tweb/events', {
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
        fetchEvents();
        if(viewUpdateM){setViewUpdateM(false)}
    }, [viewUpdateM]);


    const elems = events.map((e, index) => (
        <EvInfo
            key={index}
            nomeEvento={e.nomeevento}
            data={e.data}
            ora={e.ora}
            imageurl={e.imageurl}
            descrizione={e.descrizione}
            prezzolista={e.prezzolista}
            prezzotavolo={e.prezzotavolo}
            setViewUpdateM={setViewUpdateM}
            style={{
                backgroundImage: `url(${e.imageurl})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: '250px',
                width: '250px',
                position: 'relative',
                flex: '0 0 auto',
                marginLeft: '10px',
            }}
        />
    ));

    const [viewPopUpA, setViewPopUpA] = useState(false);

    return <div className={"elems"}>
         {elems}
        <div className={"containerEv"} onClick={()=>{setViewPopUpA(true)}}>
            <div className={"addEv"}> </div>
            </div>
            {viewPopUpA && <ViewEdit setViewUpdateM={setViewUpdateM} name={""} data={""} ora={""} imageurl={""} descrizione={""} prezzotavolo={""}
                                     prezzolista={""} setViewPopUpE={setViewPopUpA}></ViewEdit>}
    </div>;
};

export default ManageEvent;
