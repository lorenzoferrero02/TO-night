package tweb.Manager.Events;

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
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@WebServlet(name = "eventsServlet", urlPatterns = {"/events/*"})
public class EventsServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        String token = request.getHeader("Authorization");
        if (token != null) {
            List<EventsI> eventNames = viewEvents(token);
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
    };

    public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String requestPath = request.getPathInfo();
        String[] parts = requestPath.split("/");
        response.setContentType("application/json");
        String token = request.getHeader("Authorization");
        if (token != null) {
            JsonObject requestData = JsonParser.parseReader(request.getReader()).getAsJsonObject();
            String data = requestData.get("data").getAsString();
            String nomeevento = requestData.get("nomeevento").getAsString();
            String ora = requestData.get("ora").getAsString();
            String descrizione = requestData.get("descrizione").getAsString();
            String imageurl = requestData.get("imageurl").getAsString();
            String prezzotavolo = requestData.get("prezzotavolo").getAsString();
            String prezzolista = requestData.get("prezzolista").getAsString();
            if(Objects.equals(parts[1], "edit")) {
                boolean isEdit = false;
                try {
                    isEdit = editEvent(data, nomeevento, ora, descrizione, prezzotavolo, prezzolista, imageurl);
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }

                JsonObject result = new JsonObject();
                result.addProperty("edit", isEdit);
                PrintWriter out = response.getWriter();
                out.println(result);
            } else if(Objects.equals(parts[1], "add")) {
                String username = requestData.get("username").getAsString();
                boolean isAdd = false;
                try {
                    isAdd = addEvent(username, data, nomeevento, ora, descrizione, prezzotavolo, prezzolista, imageurl);
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }

                JsonObject result = new JsonObject();
                result.addProperty("add", isAdd);
                PrintWriter out = response.getWriter();
                out.println(result);

            } else {
                response.getWriter().println("Percorso non valido");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Percorso non valido");
            }
        } else {
            response.getWriter().println("Utente non autenticato");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Utente non autenticato");
        }

    }

    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        JsonObject requestData = JsonParser.parseReader(request.getReader()).getAsJsonObject();
        String dataS = requestData.get("data").getAsString();
        boolean rm = rmEvent(dataS);

        JsonObject result = new JsonObject();
        result.addProperty("rm", rm);
        PrintWriter out = response.getWriter();
        out.println(result);
    }

    private List<EventsI> viewEvents(String username) {
        List<EventsI> eventNames = new ArrayList<>();
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("SELECT evento.nomeevento, evento.data, evento.ora, evento.imageurl, evento.descrizione, evento.prezzolista, evento.prezzotavolo " +
                     "FROM evento JOIN creazione ON creazione.data=evento.data " +
                     "WHERE creazione.nomeutente=?")) {

            st.setString(1, username);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                String nomeevento = rs.getString("nomeevento");
                String descrizione = rs.getString("descrizione");
                String prezzolista = rs.getString("prezzolista");
                String prezzotavolo = rs.getString("prezzotavolo");
                String data = rs.getString("data");
                String ora = rs.getString("ora");
                String imageurl = rs.getString("imageurl");
                EventsI event = new EventsI(nomeevento, data, ora, imageurl, descrizione, prezzolista, prezzotavolo);
                eventNames.add(event);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return eventNames;
    }
    private boolean rmEvent(String data) {
        boolean result = false;
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("DELETE FROM evento WHERE evento.data=?")) {

            st.setString(1, data);
            int rowsAffected = st.executeUpdate();

            if (rowsAffected > 0) {
                result = true;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return result;
    }
    private boolean editEvent(String data, String nomeevento, String ora, String descrizione, String prezzotavolo, String prezzolista, String imageurl) throws ParseException {
        boolean result = false;
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("UPDATE evento SET nomeevento=?, ora=?, descrizione=?, prezzotavolo=?, prezzolista=?, imageurl=? " +
                     "WHERE evento.data=?")) {

            st.setString(1, nomeevento);
            st.setString(2, ora);
            st.setString(3, descrizione);
            st.setString(4, prezzotavolo);
            st.setString(5, prezzolista);
            st.setString(6, imageurl);
            st.setString(7, data);
            int rowsAffected = st.executeUpdate();

            if (rowsAffected > 0) {
                result = true;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return result;
    }
    private boolean addEvent(String username, String data, String nomeevento, String ora, String descrizione, String prezzotavolo, String prezzolista, String imageurl) throws ParseException {
        boolean result_st = false;
        boolean result_rt = false;
        boolean result_tt = false;
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("INSERT INTO evento (data, nomeevento, prezzotavolo, prezzolista, imageurl, descrizione, ora) " +
                     "VALUES (?,?,?,?,?,?,?) ")) {

            st.setString(2, nomeevento);
            st.setString(7, ora);
            st.setString(6, descrizione);
            st.setString(3, prezzotavolo);
            st.setString(4, prezzolista);
            st.setString(5, imageurl);
            st.setString(1, data);

            int rowsAffected = st.executeUpdate();

            if (rowsAffected > 0) {
                result_st = true;
            }

            PreparedStatement rt = conn.prepareStatement("INSERT INTO creazione (nomeutente, data) VALUES (?,?)");{
                rt.setString(1, username);
                rt.setString(2, data);
            }
            rowsAffected = rt.executeUpdate();

            if (rowsAffected > 0) {
                result_rt = true;
            }
            for(int c=1; c<=10; c++) {
                PreparedStatement tt = conn.prepareStatement("INSERT INTO tavolo (id, data) VALUES (?,?)");{
                    tt.setInt(1, c);
                    tt.setString(2, data);
                }
                rowsAffected = tt.executeUpdate();

                if (rowsAffected > 0) {
                    result_tt = true;
                }
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }


        return result_st && result_rt && result_tt;
    }

}
