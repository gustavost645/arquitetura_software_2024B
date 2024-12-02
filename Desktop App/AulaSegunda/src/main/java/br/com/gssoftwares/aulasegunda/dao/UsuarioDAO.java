package br.com.gssoftwares.aulasegunda.dao;

import br.com.gssoftwares.aulasegunda.db.SQLiteConnection;
import br.com.gssoftwares.aulasegunda.model.Integracao;
import br.com.gssoftwares.aulasegunda.model.User;
import br.com.gssoftwares.aulasegunda.utils.DBUtils;
import br.com.gssoftwares.aulasegunda.utils.LocalDateTimeUtils;
import com.google.gson.Gson;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;

public class UsuarioDAO {

    private static final String API_AUTH_URL = "http://sage.gsoftwares.com.br:3001/auth/users";

    public List<User> findAll() {
        List<User> users = new ArrayList<>();
        String sql = "SELECT id, username, email, password, logradouro, numero, bairro, cidade FROM usuarios";

        try (Connection conn = SQLiteConnection.connect(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                // Recuperar os dados da consulta
                String id = rs.getString("id");
                String username = rs.getString("username");
                String email = rs.getString("email");
                String password = rs.getString("password");
                String logradouro = rs.getString("logradouro");
                String numero = rs.getString("numero");
                String bairro = rs.getString("bairro");
                String cidade = rs.getString("cidade");

                // Criar um objeto User e adicionar à lista
                users.add(new User(id, username, email, password, logradouro, numero, bairro, cidade, null, null));
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Erro : " + e.getMessage(), "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(UsuarioDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return users;
    }

    public User salvarUsuario(User user, boolean isJob) {
        String sql = null;

        if (isJob) {
            sql = "INSERT INTO usuarios ("
                    + "id, username, email, password, logradouro, numero, bairro, cidade, createdAt, updatedAt"
                    + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        } else {
            sql = "INSERT OR REPLACE INTO usuarios ("
                    + "id, username, email, password, logradouro, numero, bairro, cidade, createdAt, updatedAt"
                    + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        }

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getId());
            pstmt.setString(2, user.getUsername());
            pstmt.setString(3, user.getEmail());
            pstmt.setString(4, user.getPassword());
            pstmt.setString(5, user.getLogradouro());
            pstmt.setString(6, user.getNumero());
            pstmt.setString(7, user.getBairro());
            pstmt.setString(8, user.getCidade());
            pstmt.setString(9, LocalDateTimeUtils.formatDateTime(user.getCreatedAt()));
            pstmt.setString(10, LocalDateTimeUtils.formatDateTime(user.getUpdatedAt()));

            pstmt.executeUpdate();
            System.out.println("Usuário salvo com sucesso: " + user.getUsername());

            if (isJob) {
                Integracao integracao = new Integracao();
                integracao.setId(UUID.randomUUID().toString());
                integracao.setTipo("C");
                integracao.setConteudoJson(new Gson().toJson(user));
                integracao.setDataStamp(LocalDateTimeUtils.formatDateTime(null));
                integracao.setServicoRest(String.format("http://sage.gsoftwares.com.br:3001/auth/%s", "register"));
                DBUtils.gravaRegistroIntegracao(integracao);
            }

            return user;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Erro : " + e.getMessage(), "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(UsuarioDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return null;
    }

    public User updateUsuario(User user, boolean isJob) {
        String sql = "UPDATE usuarios SET "
                + "username = ?, email = ?, password = ?, "
                + "logradouro = ?, numero = ?, bairro = ?, cidade = ?, "
                + "updatedAt = ? WHERE id = ?";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getEmail());
            pstmt.setString(3, user.getPassword());
            pstmt.setString(4, user.getLogradouro());
            pstmt.setString(5, user.getNumero());
            pstmt.setString(6, user.getBairro());
            pstmt.setString(7, user.getCidade());
            pstmt.setString(8, LocalDateTimeUtils.formatDateTime(user.getUpdatedAt()));  // Atualize com a data atual, se necessário
            pstmt.setString(9, user.getId());

            int affectedRows = pstmt.executeUpdate();

            if (affectedRows > 0) {
                System.out.println("Usuário atualizado com sucesso: " + user.getUsername());

                if (isJob) {
                    Integracao integracao = new Integracao();
                    integracao.setId(UUID.randomUUID().toString());
                    integracao.setTipo("U");
                    integracao.setConteudoJson(new Gson().toJson(user));
                    integracao.setDataStamp(LocalDateTimeUtils.formatDateTime(null));
                    integracao.setServicoRest(String.format("%s/%s", API_AUTH_URL, user.getId()));
                    DBUtils.gravaRegistroIntegracao(integracao);
                }

                return user;
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Erro : " + e.getMessage(), "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(UsuarioDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return null;
    }

    public void remove(User user, boolean isJob) {
        String sql = "DELETE FROM usuarios WHERE id = ?";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getId());

            int affectedRows = pstmt.executeUpdate();

            if (affectedRows > 0) {
                if (isJob) {
                    Integracao integracao = new Integracao();
                    integracao.setId(UUID.randomUUID().toString());
                    integracao.setTipo("D");
                    integracao.setConteudoJson(new Gson().toJson(user));
                    integracao.setDataStamp(LocalDateTimeUtils.formatDateTime(null));
                    integracao.setServicoRest(String.format("%s/%s", API_AUTH_URL, user.getId()));
                    DBUtils.gravaRegistroIntegracao(integracao);
                }
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Erro : " + e.getMessage(), "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(UsuarioDAO.class.getName()).log(Level.SEVERE, null, e);
        }
    }

    public User findById(String codigoUsuario) {
        List<User> users = new ArrayList<>();
        String sql = "SELECT id, username, email, password, logradouro, numero, bairro, cidade FROM usuarios where id= '" + codigoUsuario + "'";

        try (Connection conn = SQLiteConnection.connect(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                // Recuperar os dados da consulta
                String id = rs.getString("id");
                String username = rs.getString("username");
                String email = rs.getString("email");
                String password = rs.getString("password");
                String logradouro = rs.getString("logradouro");
                String numero = rs.getString("numero");
                String bairro = rs.getString("bairro");
                String cidade = rs.getString("cidade");

                // Criar um objeto User e adicionar à lista
                users.add(new User(id, username, email, password, logradouro, numero, bairro, cidade, null, null));
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Erro : " + e.getMessage(), "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(UsuarioDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return users.isEmpty() ? null : users.get(0);
    }

    public void removeAll() {
        String sql = "DELETE FROM usuarios WHERE id = id";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.executeUpdate();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Erro : " + e.getMessage(), "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(UsuarioDAO.class.getName()).log(Level.SEVERE, null, e);
        }
    }

}
