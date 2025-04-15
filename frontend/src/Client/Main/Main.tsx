import {FC} from 'react';
import Evento from '../Evento/Evento.tsx';
import './main.css';
import {MainI} from "../interfaceClient.ts";

const Main: FC<MainI> = ({viewUpdate, setViewUpdate }) => {
    return (
        <div className={'main'}>
            <Evento setViewUpdate={setViewUpdate} viewUpdate={viewUpdate}></Evento>
        </div>
    );
}

export default Main;
