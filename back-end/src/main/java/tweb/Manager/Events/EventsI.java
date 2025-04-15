package tweb.Manager.Events;

import tweb.db.PoolingPersistenceManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class EventsI {
    private String nomeevento;
    private String data;
    private String ora;
    private String imageurl;
    private String descrizione;
    private String prezzolista;
    private String prezzotavolo;


    public EventsI(String nomeevento, String data, String ora, String imageurl, String descrizione, String prezzolista, String prezzotavolo) {
        this.nomeevento=nomeevento;
        this.ora=ora;
        this.data=data;
        this.imageurl=imageurl;
        this.descrizione=descrizione;
        this.prezzolista=prezzolista;
        this.prezzotavolo=prezzotavolo;
    }

}