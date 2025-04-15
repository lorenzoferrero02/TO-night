import {FC, useEffect, useState} from "react";
import './ViewEdit.css';
import Apply from "./Apply/Apply.tsx";
import {ViewEditI} from "../intefaceManager.ts";



const ViewEdit: FC<ViewEditI> = ({setViewPopUpE, setViewUpdateM,
                                     name, data, ora, descrizione,
                                      prezzolista, prezzotavolo, imageurl})=>{

    const [viewDateForm, setViewDateForm ] = useState(false)

    const closePopUp = () => {
        setViewPopUpE(false);
    };

    const [value, setValue] =
        useState<{ data: string; nomeevento: string; ora: string; imageurl: string, descrizione: string, prezzolista: string, prezzotavolo:string }>({
            nomeevento: name,
            data: data,
            ora: ora,
            imageurl: imageurl,
            descrizione: descrizione,
            prezzolista: prezzolista,
            prezzotavolo: prezzotavolo
        })

    useEffect(()=>{
        if (value.data === "") {
            setViewDateForm(true)
        }
    }, [value.data])

    return (
        <div className={"glasspane"}>
            <div className={"subTable"}>
                {viewDateForm ? (<h1> Aggiungi Evento </h1>):(<h1> Modifica Evento</h1>)}
                    <form className="modalform">
                        <div className={"labelN"}>
                            <label>Nome</label>
                            <input type="text" className={"name"}
                                   id="name"
                                   name="evento_name"
                                   value={value.nomeevento}
                                   onChange={(e) => {
                                       setValue({
                                           ...value,
                                           nomeevento: e.target.value
                                       })
                                   }}/>
                        </div>
                        {viewDateForm && <div className={"labelD"}>
                        <label>Data</label>
                        <input type="date" className={"data"}
                               id="data"
                               name="evento_data"
                               value={value.data}
                               onChange={(e) => {
                                   setValue({
                                       ...value,
                                       data: e.target.value
                                   })
                               }}
                        />
                        </div>}
                        <div className={"labelT"}>
                        <label>Ora</label>
                        <input type="time" className={"time"}
                               id="ora"
                               name="evento_ora"
                               value={value.ora}
                               onChange={(e) => {
                                   setValue({
                                       ...value,
                                       ora: e.target.value
                                   })
                               }}/>
                        </div>
                        <div className={"labelI"}>
                            <label>Immagine</label>
                            <div className={"selectImage"}>
                            <input
                                type="file"
                                className={"image"}
                                id="image"
                                name="evento_image"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const selectedFile = e.target.files[0];
                                        const reader = new FileReader();
                                        const nameFile = selectedFile.name as string;

                                        reader.onload = (event) => {
                                            if (event.target) {
                                                const imageURL = "src/assets/" + nameFile;
                                                setValue({
                                                    ...value,
                                                    imageurl: imageURL,
                                                });
                                            }
                                        };

                                        reader.readAsDataURL(selectedFile);
                                    }
                                }}
                            />
                            </div>

                        </div>
                        <div className={"labelDesc"}>
                            <label>Descrizione</label>
                            <textarea className={"desc"}
                                   id="desc"
                                   name="evento_desc"
                                   value={value.descrizione}
                                   onChange={(e) => {
                                       setValue({
                                           ...value,
                                           descrizione: e.target.value
                                       })
                                   }}/>
                        </div>
                        <div className={"labelPL"}>
                            <label>Prezzo Lista</label>
                            <input type="number" className={"pl"}
                                   id="pl"
                                   name="evento_pl"
                                   value={value.prezzolista}
                                   onChange={(e) => {
                                       setValue({
                                           ...value,
                                           prezzolista: e.target.value
                                       })
                                   }}/>
                        </div>
                        <div className={"labelPT"}>
                            <label>Prezzo Tavolo</label>
                            <input type="number" className={"pt"}
                                   id="pt"
                                   name="evento_pt"
                                   value={value.prezzotavolo}
                                   onChange={(e) => {
                                       setValue({
                                           ...value,
                                           prezzotavolo: e.target.value
                                       })
                                   }}/>
                        </div>
                        {value.data && (
                            <Apply  setViewUpdateM={setViewUpdateM} name={value.nomeevento} data={value.data} ora={value.ora} descrizione={value.descrizione}
                               prezzolista={value.prezzolista} prezzotavolo={value.prezzotavolo} imageurl={value.imageurl} setViewPopUpE={setViewPopUpE} viewDateForm={viewDateForm}></Apply>
                        )}
                    </form>
                <div className={"bClose"} onClick={closePopUp}></div>
            </div>
        </div>
    )
}
export default ViewEdit