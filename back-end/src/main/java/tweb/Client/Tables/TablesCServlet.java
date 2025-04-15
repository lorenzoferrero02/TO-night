package tweb.Client.Tables;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tweb.db.PoolingPersistenceManager;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@WebServlet(name = "clientTableServlet", urlPatterns = {"/tablesc/*"})
public class TablesCServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        String requestPath = request.getPathInfo();
        String[] parts = requestPath.split("/");
        if (parts.length > 1) {
            String path = parts[1];
            String token = request.getHeader("Authorization");
            if (token != null) {
                if(path.equals("mine")) {
                    List<MyTableI> myTables = viewMyTables(token);
                    String eventsResponse = new Gson().toJson(myTables);
                    try (PrintWriter out = response.getWriter()) {
                        out.println(eventsResponse);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                if(path.equals("new")){
                    String data = parts[2];
                    List<NewTableI> newTables = viewNewTables(data);
                    String eventsResponse = new Gson().toJson(newTables);
                    try (PrintWriter out = response.getWriter()) {
                        out.println(eventsResponse);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

            } else {
                response.getWriter().println("Utente non autenticato");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Utente non autenticato");
            }
        } else {
            response.getWriter().println("Percorso non valido");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Percorso non valido");
        }
    }
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        String requestPath = request.getPathInfo();
        String[] parts = requestPath.split("/");
        JsonObject result = new JsonObject();
        if (parts.length > 1) {
            String token = request.getHeader("Authorization");
            String data = parts[1];
            if (token != null) {
                boolean success = rmTable(token, data);
                result.addProperty("operation", "rmTable");
                result.addProperty("success", success);
                PrintWriter out = response.getWriter();
                out.println(result);
            } else {
                response.getWriter().println("Utente non autenticato");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Utente non autenticato");
            }
        } else {
            response.getWriter().println("Percorso non valido");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Percorso non valido");
        }
    }
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        JsonObject requestData = JsonParser.parseReader(request.getReader()).getAsJsonObject();
        String token = request.getHeader("Authorization");
        if(token != null){
            String username = requestData.get("username").getAsString();
            String data = requestData.get("evento").getAsString();
            int idTable = requestData.get("idTable").getAsInt();
            boolean userSubscribed = subTable(username, data, idTable);

            JsonObject result = new JsonObject();
            result.addProperty("subscribed", userSubscribed);
            PrintWriter out = response.getWriter();
            out.println(result);
        } else {
        response.getWriter().println("Utente non autenticato");
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Utente non autenticato");
    }
    }

    private List<NewTableI> viewNewTables(String data) {
        List<NewTableI> eventNames = new ArrayList<>();
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("SELECT tavolo.id, COUNT(cliente) AS numClient FROM partecipa\n" +
                     "                     RIGHT JOIN tavolo ON partecipa.idtable = tavolo.id and partecipa.data = tavolo.data\n" +
                     "                     where tavolo.data = ?\n" +
                     "                     group by tavolo.id\n" +
                     "                     having COUNT(cliente) < 20 order by tavolo.id")) {
            st.setString(1, data);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                int idTable = rs.getInt("id");
                int numClient = rs.getInt("numClient");
                NewTableI event = new NewTableI(idTable, numClient);
                eventNames.add(event);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return eventNames;
    }
    private List<MyTableI> viewMyTables(String username) {
        List<MyTableI> eventNames = new ArrayList<>();
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("SELECT evento.nomeevento, evento.data, evento.ora, partecipa.idtable FROM evento " +
                     "JOIN partecipa ON partecipa.data = evento.data " +
                     "WHERE partecipa.cliente = ?")) {

            st.setString(1, username);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                String nomeEvento = rs.getString("nomeevento");
                String data = rs.getString("data");
                String ora = rs.getString("ora");
                String idtable = rs.getString("idtable");
                MyTableI event = new MyTableI(nomeEvento, data, ora, idtable);
                eventNames.add(event);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return eventNames;
    }
    private boolean subTable(String username, String data, int idtable){
        boolean result = false;
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("INSERT INTO partecipa (idtable, data, cliente) VALUES (?, ?, ?)")) {
            st.setInt(1, idtable);
            st.setString(2, data);
            st.setString(3, username);
            int rowsAffected = st.executeUpdate();

            if (rowsAffected > 0) {
                result = true;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return result;
    }
    private boolean rmTable(String username, String data) {
        boolean result = false;
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("DELETE FROM partecipa\n" +
                     "WHERE partecipa.data = ? AND partecipa.cliente = ?")) {
            st.setString(1, data);
            st.setString(2, username);
            int update = st.executeUpdate();

            if (update> 0) {
                result = true;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return result;
    }

}
