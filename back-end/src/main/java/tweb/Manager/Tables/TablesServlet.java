package tweb.Manager.Tables;

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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@WebServlet(name = "tablesServlet", urlPatterns = {"/tables/*"})
public class TablesServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        String requestPath = request.getPathInfo();
        String[] parts = requestPath.split("/");
        if (parts.length > 1) {
            String path = parts[1];
            if(path.equals("det")){
                String auth = request.getHeader("Authorization");
                if (auth != null) {
                    String id = parts[2];
                    String dataS = parts[3];
                    List<TableDetI> tables = viewTablesDet(auth, id, dataS);
                    String eventsResponse = new Gson().toJson(tables);
                    try (PrintWriter out = response.getWriter()) {
                        out.println(eventsResponse);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else {
                    response.getWriter().println("Utente non autenticato");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Utente non autenticato");
                }

            }else if(path.equals("all")) {
                String token = request.getHeader("Authorization");
                if (token != null) {
                    List<TablesI> eventNames = viewTables(token);
                    String eventsResponse = new Gson().toJson(eventNames);
                    try (PrintWriter out = response.getWriter()) {
                        out.println(eventsResponse);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else {
                    response.getWriter().println("Utente non autenticato");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Utente non autenticato");
                }
            }
        } else {
            response.getWriter().println("Percorso non valido");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Percorso non valido");
        }
    }
    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        JsonObject requestData = JsonParser.parseReader(request.getReader()).getAsJsonObject();
        String cliente = requestData.get("cliente").getAsString();
        String data = requestData.get("data").getAsString();
        boolean rm = rmClient(cliente, data);

        JsonObject result = new JsonObject();
        result.addProperty("rm", rm);
        PrintWriter out = response.getWriter();
        out.println(result);
    }

    private boolean rmClient(String cliente, String data) {
        boolean result = false;
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("DELETE FROM partecipa WHERE partecipa.cliente=? AND partecipa.data=?")) {

            st.setString(1, cliente);
            st.setString(2, data);
            int rowsAffected = st.executeUpdate();

            if (rowsAffected > 0) {
                result = true;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return result;
    }

    private List<TablesI> viewTables(String username) {
        List<TablesI> eventNames = new ArrayList<>();
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("SELECT tavolo.id, tavolo.data, COUNT(partecipa.cliente) AS numClient FROM tavolo\n" +
                     "LEFT JOIN partecipa on tavolo.id = partecipa.idtable and tavolo.data = partecipa.data\n" +
                     "group by tavolo.id, tavolo.data order by tavolo.id")) {

            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                String id = String.valueOf(rs.getInt("id"));
                String data = rs.getString("data");
                String numClient = String.valueOf(rs.getInt("numClient"));
                TablesI event = new TablesI(id, data, numClient);
                eventNames.add(event);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return eventNames;
    }
    private List<TableDetI> viewTablesDet(String username, String id, String data) {
        List<TableDetI> eventNames = new ArrayList<>();
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("SELECT partecipa.idtable, partecipa.data, partecipa.cliente FROM partecipa " +
                     "WHERE partecipa.idtable=? AND partecipa.data=?")) {

            st.setInt(1, Integer.parseInt(id));
            st.setString(2, data);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                String idT = String.valueOf(rs.getInt("idtable"));
                String nomecliente = rs.getString("cliente");
                String dataT = rs.getString("data");
                TableDetI event = new TableDetI(idT, nomecliente, dataT);
                eventNames.add(event);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return eventNames;
    }
}
