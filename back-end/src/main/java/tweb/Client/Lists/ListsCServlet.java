package tweb.Client.Lists;

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


@WebServlet(name = "listServlet", urlPatterns = {"/mylists/*"})
public class ListsCServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        String token = request.getHeader("Authorization");
        if (token != null) {
            List<MyListI> eventNames = viewLists(token);
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



    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        String requestPath = request.getPathInfo();
        String[] parts = requestPath.split("/");
        JsonObject result = new JsonObject();
        if (parts.length > 1) {
            String token = request.getHeader("Authorization");
            String data = parts[1];
            if (token != null) {
                boolean success = rmList(token, data);
                result.addProperty("operation", "rmList");
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
        if (token != null) {
            String username = requestData.get("username").getAsString();
            String data = requestData.get("evento").getAsString();
            boolean userSubscribed  = subList(username, data);

            JsonObject result = new JsonObject();
            result.addProperty("subscribed", userSubscribed);
            PrintWriter out = response.getWriter();
            out.println(result);
        } else {
            response.getWriter().println("Utente non autenticato");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Utente non autenticato");
        }
    }

    private List<MyListI> viewLists(String username) {
        List<MyListI> eventNames = new ArrayList<>();
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("SELECT evento.nomeevento, evento.data, evento.ora FROM evento " +
                     "JOIN lista ON lista.data = evento.data " +
                     "WHERE lista.cliente = ?")) {

            st.setString(1, username);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                String nomeEvento = rs.getString("nomeevento");
                String data = rs.getString("data");
                String ora = rs.getString("ora");
                MyListI event = new MyListI(nomeEvento, data, ora);
                eventNames.add(event);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return eventNames;
    }
    private boolean rmList(String username, String data) {
        boolean result = false;
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("DELETE FROM lista\n" +
                     "WHERE lista.data = ? AND lista.cliente = ?")) {
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
    private boolean subList(String username, String data) {
        boolean result = false;
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("INSERT INTO lista (nomelista, data, cliente) VALUES ('lista1', ?, ?)")) {
            st.setString(1, data);
            st.setString(2, username);
            int rowsAffected = st.executeUpdate();

            if (rowsAffected > 0) {
                result = true;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return result;
    }
}
