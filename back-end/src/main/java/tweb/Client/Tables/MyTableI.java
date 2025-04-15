package tweb.Client.Tables;

public class MyTableI {
    private String nomeEvento;
    private String data;
    private String ora;
    private String idTable;

    public MyTableI(String nomeEvento, String data, String ora, String idTable) {
        this.nomeEvento = nomeEvento;
        this.data = data;
        this.ora = ora;
        this.idTable = idTable;
    }
}