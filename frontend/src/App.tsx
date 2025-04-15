import {useEffect} from 'react';
import './App.css';
import Login from "./Login/Login.tsx";

function App() {
    useEffect(() => {
        document.title = "TOnight";
    }, []);
    return(
        <>
        <Login></Login>
        </>
    )
}

export default App;
