package tweb.Manager.EvList;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tweb.Manager.EvList.EvListI;
import tweb.db.PoolingPersistenceManager;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@WebServlet(name = "evlistServlet", urlPatterns = {"/evlist/*"})
public class EvListServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        String token = request.getHeader("Authorization");
        if (token != null) {
            List<EvListI> eventNames = viewLists(token);
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

    private List<EvListI> viewLists(String username) {
        List<EvListI> eventNames = new ArrayList<>();
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("SELECT lista.cliente, lista.data, lista.nomelista " +
                     "FROM creazione JOIN lista ON creazione.data=lista.data " +
                     "WHERE creazione.nomeutente=?")) {

            st.setString(1, username);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                String nomecliente = rs.getString("cliente");
                String nomelista = rs.getString("nomelista");
                String data = rs.getString("data");
                EvListI event = new EvListI(nomecliente, nomelista, data);
                eventNames.add(event);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return eventNames;
    }
    private boolean rmClient(String cliente, String data) {
        boolean result = false;
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("DELETE FROM lista WHERE lista.cliente=? AND lista.data=?")) {

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
}
