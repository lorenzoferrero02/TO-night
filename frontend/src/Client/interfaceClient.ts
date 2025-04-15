import React from "react";

/* Evento.tsx */
export interface MyEventI{
    setViewUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    nomeEvento: string;
    data: string;
    ora: string;
    descrizione: string;
    prezzoTavolo: string;
    prezzoLista: string;
    imageUrl: string;
    style?: React.CSSProperties;
}

export interface EventI{
    viewUpdate: boolean;
    setViewUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

/* Main.tsx */
export interface MainI {
    viewUpdate: boolean;
    setViewUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

/* PersonalArea.tsx */
export interface PersonalAreaI{
    setViewPopUp: React.Dispatch<React.SetStateAction<boolean>>;
    setViewUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface MyListI{
    nomeEvento: string;
    data: string;
    ora: string;
    style?: React.CSSProperties;
    setViewUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface MyTableI{
    nomeEvento: string;
    data: string;
    ora: string;
    idTable: string;
    style?: React.CSSProperties;
    setViewUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

/* RmList.tsx */
export interface RmListI {
    keyEvento: string;
    setViewUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    setViewItems: React.Dispatch<React.SetStateAction<boolean>>;
}

/* RmTable.tsx */
export interface RmTableI {
    keyEvento: string;
    setViewUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    setViewItems: React.Dispatch<React.SetStateAction<boolean>>;
}

/* SubList.tsx */
export interface SubListI {
    setViewPopUpL: React.Dispatch<React.SetStateAction<boolean>>;
    keyEvento: string;
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

/* SubTable.tsx */
export interface SubTableI{
    setViewPopUp: React.Dispatch<React.SetStateAction<boolean>>;
    keyEvento: string;
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface TableInfoI{
    idTable: number;
    numClient: number;
    setViewPopUp: React.Dispatch<React.SetStateAction<boolean>>;
    keyEvento: string;
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>;

}

/* TopBar.tsx */
export interface TopBarI{
    setViewUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

