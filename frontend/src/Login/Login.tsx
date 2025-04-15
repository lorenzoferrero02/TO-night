import { useState } from 'react';
import Main from "../Client/Main/Main.tsx";
import TopBar from "../Client/Topbar/TopBar.tsx";
import './Login.css';
import MainManager from "../Manager/MainManager/MainManager.tsx";
import TopBarManager from "../Manager/TopbarManager/TopBarManager.tsx";
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedRole, setLoggedRole] = useState(false); // false -> client || true -> manager
    const [viewUpdate, setViewUpdate] = useState(false)


    const fetchLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/progetto-tweb/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json, Authorization',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            const success = data.success;
            const errorMessage = data.errorMessage;
            const role = data.role;

            if (success) {
                setIsLoggedIn(true);
                if(role === "manager"){
                    setLoggedRole(true);
                } else {
                    setLoggedRole(false);
                }

                const token = data.username;
                if(token != null)
                    localStorage.setItem('token', token);

                console.log('L\'utente ha effettuato l\'accesso con successo!')

            } else {
                console.error('Errore durante il login:', errorMessage);
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Errore durante il login:', error);
        }

    };

    return (
        <>
            {isLoggedIn ? (
                loggedRole ? (  // page manager
                    <div className={"login"}>
                        <TopBarManager setIsLoggedIn={setIsLoggedIn}></TopBarManager>
                        <section className={'titolo'}>
                            <h1> I Tuoi Eventi!  </h1>
                        </section>
                        <MainManager></MainManager>

                    </div>
                ):(             // page client
                    <div className={"login"}>
                    <TopBar setViewUpdate={setViewUpdate} setIsLoggedIn={setIsLoggedIn}></TopBar>
                    <section className={'titolo'}>
                        <h1> Nuovi eventi </h1>
                    </section>
                    <Main viewUpdate={viewUpdate} setViewUpdate={setViewUpdate}></Main>
                </div>
            )
            ) : (
                <div className={"backgroundLogin"}>
                    <form className={"form"} >
                        <h2> Benvenuto! </h2>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className={"enter-button"} onClick={fetchLogin}> Entra </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
};

export default Login;
