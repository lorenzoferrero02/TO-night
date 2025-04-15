package tweb.login;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import tweb.db.PoolingPersistenceManager;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.Map;
import java.util.Objects;

@WebServlet(name = "loginServlet", urlPatterns = {"/login", "/logout"})
public class LoginServlet extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (request.getServletPath().equals("/login")) {
            response.setContentType("application/json");
            BufferedReader in = request.getReader();
            JsonObject loginObject = JsonParser.parseReader(in).getAsJsonObject();
            String username = loginObject.get("username").getAsString();
            String password = loginObject.get("password").getAsString();
            JsonObject result = new JsonObject();

            int valid = validateCredentials(username, password);
            if (valid == 1) {
                result.addProperty("username", username);
                result.addProperty("success", true);
                result.addProperty("errorMessage", "");
                result.addProperty("role", "client");
                response.setHeader("Authorization", username);
            } else if(valid == 2){
                result.addProperty("username", username);
                result.addProperty("success", true);
                result.addProperty("errorMessage", "");
                result.addProperty("role", "manager");
                response.setHeader("Authorization", username);
            } else {
                result.addProperty("username", username);
                result.addProperty("success", false);
                result.addProperty("errorMessage", "Invalid credentials");
                result.addProperty("role", "");
            }

            PrintWriter out = response.getWriter();
            out.println(result);
        } else if (request.getServletPath().equals("/logout")) {
            response.setContentType("application/json");
            BufferedReader in = request.getReader();
            JsonObject loginObject = JsonParser.parseReader(in).getAsJsonObject();
            String username = loginObject.get("username").getAsString();
            JsonObject result = new JsonObject();
            if(username != null) {
                result.addProperty("success", true);
                String token = " ";
                response.setHeader("Authorization", token);
            } else {
                result.addProperty("success", false);
            }
            PrintWriter out = response.getWriter();
            out.println(result);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }


    public int validateCredentials(String username, String password) {
        int result = 0;
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("SELECT * FROM cliente " +
                     "WHERE nomeutente = ? AND password = ?");) {
            st.setString(1, username);
            st.setString(2, password);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                result = 1;
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("SELECT * FROM organizzatore " +
                     "WHERE nomeutente = ? AND password = ?");) {
            st.setString(1, username);
            st.setString(2, password);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                result = 2;
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
        }

        return result;
    }
}