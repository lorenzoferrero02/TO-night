package tweb.Client.newEvents;

public class NewEventsI {
    private String nomeEvento;
    private String data;
    private String ora;
    private String descrizione;
    private String prezzoTavolo, prezzoLista, imageUrl;
    public NewEventsI(String nomeEvento, String data, String ora, String descrizione, String prezzoTavolo,  String prezzoLista, String imageUrl) {
        this.nomeEvento = nomeEvento;
        this.data = data;
        this.ora = ora;
        this.descrizione = descrizione;
        this.prezzoTavolo = prezzoTavolo;
        this.prezzoLista = prezzoLista;
        this.imageUrl = imageUrl;
    }
}