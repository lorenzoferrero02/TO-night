import {FC} from 'react';
import ManageEvent from '../ManageEvent/ManageEvent.tsx';
import './MainManager.css';

const MainManager: FC = () => {
    return (
        <div className={'mainManager'}>
            <ManageEvent></ManageEvent>
        </div>
    );
}

export default MainManager;
