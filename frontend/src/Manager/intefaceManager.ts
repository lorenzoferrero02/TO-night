import React from "react";

export interface TopBarManagerI{
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface RmEventI{
    data: string
    setViewUpdateM: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EventoInfoI{
    data: string;
    nomeEvento: string;
    ora: string;
    style?: React.CSSProperties;
    imageurl: string;
    selected?: EventoI
    descrizione: string
    prezzolista: string;
    prezzotavolo: string;
    setViewUpdateM: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ApplyI{
    viewDateForm: boolean
    name: string
    data: string
    ora: string
    descrizione: string
    prezzolista: string
    prezzotavolo: string
    imageurl: string
    setViewPopUpE: React.Dispatch<React.SetStateAction<boolean>>;
    setViewUpdateM: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EventoI {
    data: string;
    nomeevento: string;
    ora: string;
    style?: React.CSSProperties;
    imageurl: string;
    descrizione: string;
    prezzolista: string;
    prezzotavolo: string;
}
export interface ViewEditI{
    name: string
    data: string
    ora: string
    imageurl: string
    descrizione: string
    prezzolista: string
    prezzotavolo: string
    setViewPopUpE: React.Dispatch<React.SetStateAction<boolean>>;
    setViewUpdateM: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface RmClientLI{
    nomecliente: string
    data: string
    setViewUpdateM: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ViewListI{
    evData: string,
    setViewPopUpL: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ListEvI {
    nomelista: string;
    data: string;
    nomecliente: string;
}
export interface RmClientTI{
    nomecliente: string
    data: string
    setViewUpdateM: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface TableDetI{
    id: string
    evData: string
    setViewDet: React.Dispatch<React.SetStateAction<boolean>>;
    setViewClientCount: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface InTableI{
    id: string;
    nomecliente: string
    data: string
}
export interface MembersI{
    member: string
    setViewMemberUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ViewTableI{
    evData: string
    setViewPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface AllTablesI{
    id: string
    data: string
    numClient: string
}

export interface SingleTableI{
    id: string
    numClient: string
    setViewCountClient: React.Dispatch<React.SetStateAction<boolean>>;
}