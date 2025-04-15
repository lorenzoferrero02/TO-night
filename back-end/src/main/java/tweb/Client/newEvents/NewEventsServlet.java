package tweb.Client.newEvents;

import com.google.gson.Gson;
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


@WebServlet(name = "newEventsServlet", urlPatterns = {"/newevents/*"})
public class NewEventsServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        String token = request.getHeader("Authorization");
        if (token != null) {
            List<NewEventsI> eventNames = viewEvents(token);
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

    private List<NewEventsI> viewEvents(String username) {
        List<NewEventsI> eventNames = new ArrayList<>();
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("SELECT evento.nomeevento, evento.data, evento.ora, evento.descrizione, evento.prezzoTavolo, evento.prezzoLista, evento.imageUrl\n" +
                     "FROM evento\n" +
                     "WHERE evento.data NOT IN (\n" +
                     "    SELECT data\n" +
                     "    FROM partecipa\n" +
                     "    WHERE cliente = ?\n" +
                     ")\n" +
                     "  AND evento.data NOT IN (\n" +
                     "    SELECT data\n" +
                     "    FROM lista\n" +
                     "    WHERE cliente = ?\n" +
                     ") order by data")) {

            st.setString(1, username);
            st.setString(2, username);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                String nomeEvento = rs.getString("nomeevento");
                String data = rs.getString("data");
                String ora = rs.getString("ora");
                String descrizione = rs.getString("descrizione");
                String prezzoTavolo = rs.getString("prezzoTavolo");
                String prezzoLista = rs.getString("prezzoLista");
                String imageUrl = rs.getString("imageUrl");
                NewEventsI event = new NewEventsI(nomeEvento, data, ora, descrizione, prezzoTavolo, prezzoLista, imageUrl);
                eventNames.add(event);
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return eventNames;
    }
}
