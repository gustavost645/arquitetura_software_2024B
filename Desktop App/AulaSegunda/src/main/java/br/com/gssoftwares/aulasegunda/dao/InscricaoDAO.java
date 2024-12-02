package br.com.gssoftwares.aulasegunda.dao;

import br.com.gssoftwares.aulasegunda.db.SQLiteConnection;
import br.com.gssoftwares.aulasegunda.model.Evento;
import br.com.gssoftwares.aulasegunda.model.Inscricao;
import br.com.gssoftwares.aulasegunda.model.Integracao;
import br.com.gssoftwares.aulasegunda.utils.DBUtils;
import br.com.gssoftwares.aulasegunda.utils.LocalDateTimeUtils;
import com.google.gson.Gson;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class InscricaoDAO {

    private static final String API_INSCRICAO_URL = "http://sage.gsoftwares.com.br:3005/inscricao";

    // Métodos para interagir com o banco de dados
    public Inscricao salvarInscricao(Inscricao inscricao, boolean isJob) {
        String sql = null;
        
        if(isJob){
            sql = "INSERT INTO Inscricao (id, usuarioId, eventoId, presente, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)";
        }else{
            sql = "INSERT OR REPLACE INTO Inscricao (id, usuarioId, eventoId, presente, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)";
        }

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, inscricao.getId());
            stmt.setString(2, inscricao.getUsuarioId());
            stmt.setString(3, inscricao.getEventoId());
            stmt.setBoolean(4, inscricao.isPresente());
            stmt.setString(5, LocalDateTimeUtils.formatDateTime(inscricao.getCreatedAt()));
            stmt.setString(6, LocalDateTimeUtils.formatDateTime(inscricao.getUpdatedAt()));
            stmt.executeUpdate();
            System.out.println("Insersão salva com sucesso: " + inscricao.getId());

            if (isJob) {
                Integracao integracao = new Integracao();
                integracao.setId(UUID.randomUUID().toString());
                integracao.setTipo("C");
                integracao.setConteudoJson(new Gson().toJson(inscricao));
                integracao.setDataStamp(LocalDateTimeUtils.formatDateTime(null));
                integracao.setServicoRest(String.format("%s", API_INSCRICAO_URL));
                DBUtils.gravaRegistroIntegracao(integracao);
            }

            return inscricao;
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,"Erro : " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(InscricaoDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return null;
    }

    public Inscricao updateInscricao(Inscricao inscricao, boolean isJob) {
        String sql = "UPDATE Inscricao SET usuarioId = ?, eventoId = ?, presente = ?, updatedAt = ? WHERE id = ?";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, inscricao.getUsuarioId());
            stmt.setString(2, inscricao.getEventoId());
            stmt.setBoolean(3, inscricao.isPresente());
            stmt.setString(4, LocalDateTimeUtils.formatDateTime(LocalDateTime.now()));
            stmt.setString(5, inscricao.getId());
            int affectedRows = stmt.executeUpdate();

            if (affectedRows > 0) {
                if (isJob) {
                    Integracao integracao = new Integracao();
                    integracao.setId(UUID.randomUUID().toString());
                    integracao.setTipo("U");
                    integracao.setConteudoJson(new Gson().toJson(inscricao));
                    integracao.setDataStamp(LocalDateTimeUtils.formatDateTime(null));
                    integracao.setServicoRest(String.format("%s/%s", API_INSCRICAO_URL, inscricao.getId()));
                    DBUtils.gravaRegistroIntegracao(integracao);
                }

                return inscricao;
            }

        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,"Erro : " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(InscricaoDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return null;
    }

    public static Inscricao findById(String id) {
        String sql = "SELECT * FROM Inscricao WHERE id = ?";
        try (Connection conn = SQLiteConnection.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            try (java.sql.ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Inscricao inscricao = new Inscricao();
                    inscricao.setId(rs.getString("id"));
                    inscricao.setUsuarioId(rs.getString("usuarioId"));
                    inscricao.setEventoId(rs.getString("eventoId"));
                    inscricao.setPresente(rs.getBoolean("presente"));
                    inscricao.setCreatedAt(LocalDateTime.parse(rs.getString("createdAt"), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    inscricao.setUpdatedAt(LocalDateTime.parse(rs.getString("updatedAt"), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    return inscricao;
                }
            }

        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,"Erro : " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(InscricaoDAO.class.getName()).log(Level.SEVERE, null, e);
        }
        return null;
    }

    public void remove(Inscricao entity, boolean isJob) {
        String sql = "DELETE FROM Inscricao WHERE id = ?";
        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, entity.getId());

            int affectedRows = pstmt.executeUpdate();

            if (affectedRows > 0) {
                if (isJob) {
                    Integracao integracao = new Integracao();
                    integracao.setId(UUID.randomUUID().toString());
                    integracao.setTipo("D");
                    integracao.setConteudoJson(new Gson().toJson(entity));
                    integracao.setDataStamp(LocalDateTimeUtils.formatDateTime(null));
                    integracao.setServicoRest(String.format("%s/%s", API_INSCRICAO_URL, entity.getId()));
                    DBUtils.gravaRegistroIntegracao(integracao);
                }
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null,"Erro : " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(InscricaoDAO.class.getName()).log(Level.SEVERE, null, e);
        }
    }

    public List<Inscricao> findAll() {
        System.out.println("");
        return null;
    }

    public List<Inscricao> findByEvento(Evento evento) {
        List<Inscricao> lista = new ArrayList<>();

        String sql = " select i.*"
                + " ,      u.username  "
                + " from   Inscricao i"
                + " ,      usuarios u "
                + " where  i.usuarioId = u.id"
                + " and    i.eventoId = '" + evento.getId() + "'";

        try (Connection conn = SQLiteConnection.connect(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Inscricao e = new Inscricao();

                e.setId(rs.getString("id"));
                e.setUsuarioId(rs.getString("usuarioId"));
                e.setEventoId(rs.getString("eventoId"));
                e.setPresente(rs.getBoolean("presente"));
                e.setNomeAluno(rs.getString("username"));

                lista.add(e);
            }

        } catch (Exception e) {
            JOptionPane.showMessageDialog(null,"Erro : " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(InscricaoDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return lista;
    }

    public void inserirInscricao(Inscricao inscricao) {
        inscricao.setId(UUID.randomUUID().toString());
        salvarInscricao(inscricao, true);
    }
    
    public void removeAll() {
        String sql = "DELETE FROM Inscricao WHERE id = id";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.executeUpdate();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null,"Erro : " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(InscricaoDAO.class.getName()).log(Level.SEVERE, null, e);
        }
    }

}
