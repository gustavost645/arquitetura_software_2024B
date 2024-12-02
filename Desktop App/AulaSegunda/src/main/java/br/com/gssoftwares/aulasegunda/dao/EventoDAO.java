package br.com.gssoftwares.aulasegunda.dao;

import br.com.gssoftwares.aulasegunda.db.SQLiteConnection;
import br.com.gssoftwares.aulasegunda.model.Evento;
import br.com.gssoftwares.aulasegunda.model.Integracao;
import br.com.gssoftwares.aulasegunda.model.Template;
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
public class EventoDAO {

    private static final String API_EVENTO_URL = "http://sage.gsoftwares.com.br:3004/evento/";

    public Evento salvarEvento(Evento evento, boolean isJob) {
        String sql = null;

        if (isJob) {
            sql = "INSERT INTO eventos (id, nomeEvento, descricaoEvento, cargaHoraria , templateId) VALUES (?, ?, ?, ?, ?)";
        } else {
            sql = "INSERT OR REPLACE INTO eventos (id, nomeEvento, descricaoEvento, cargaHoraria , templateId) VALUES (?, ?, ?, ?, ?)";
        }

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, evento.getId());
            pstmt.setString(2, evento.getNomeEvento());
            pstmt.setString(3, evento.getDescricaoEvento());
            pstmt.setFloat(4, evento.getCargaHoraria());
            pstmt.setString(4, evento.getTemplateId());

            pstmt.executeUpdate();
            System.out.println("Evento salvo com sucesso: " + evento.getNomeEvento());

            if (isJob) {
                Integracao integracao = new Integracao();
                integracao.setId(UUID.randomUUID().toString());
                integracao.setTipo("C");
                integracao.setConteudoJson(new Gson().toJson(evento));
                integracao.setDataStamp(LocalDateTimeUtils.formatDateTime(null));
                integracao.setServicoRest(String.format("%s", API_EVENTO_URL));
                DBUtils.gravaRegistroIntegracao(integracao);
            }

            return evento;
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,"Erro ao salvar eventos: " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(EventoDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return null;
    }

    public List<Evento> findAll() {
        List<Evento> eventos = new ArrayList<>();
        String sql = "SELECT * FROM eventos";

        try (Connection conn = SQLiteConnection.connect(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                // Recuperar os dados da consulta
                Evento e = new Evento();
                e.setId(rs.getString("id"));
                e.setNomeEvento(rs.getString("nomeEvento"));
                e.setDescricaoEvento(rs.getString("descricaoEvento"));
                e.setCargaHoraria(rs.getFloat("cargaHoraria"));
                e.setTemplateId(rs.getString("templateId"));
                e.setCreatedAt(null);
                e.setUpdatedAt(null);

                eventos.add(e);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null,"Erro ao recuperar eventos: " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(EventoDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return eventos;
    }

    public Evento findById(String id) {
        String sql = "SELECT * FROM Inscricao WHERE id = ?";
        try (Connection conn = SQLiteConnection.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            try (java.sql.ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Evento evento = new Evento();
                    evento.setId(rs.getString("id"));
                    evento.setNomeEvento(rs.getString("nomeEvento"));
                    evento.setDescricaoEvento(rs.getString("descricaoEvento"));
                    evento.setCargaHoraria(rs.getFloat("cargaHoraria"));
                    evento.setTemplateId(rs.getString("templateId"));
                    evento.setCreatedAt(LocalDateTime.parse(rs.getString("createdAt"), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    evento.setUpdatedAt(LocalDateTime.parse(rs.getString("updatedAt"), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    return evento;
                }
            }

        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,"Erro ao recuperar evento: " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(EventoDAO.class.getName()).log(Level.SEVERE, null, e);
        }
        return null;
    }

    public Evento updateEvento(Evento evento, boolean isJob) {
        String sql = "UPDATE eventos SET nomeEvento=?, descricaoEvento=?, cargaHoraria=?, templateId=?, createdAt=?, updatedAt=? WHERE id=?";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, evento.getNomeEvento());
            pstmt.setString(2, evento.getDescricaoEvento());
            pstmt.setFloat(3, evento.getCargaHoraria());
            pstmt.setString(4, LocalDateTimeUtils.formatDateTime(evento.getCreatedAt()));
            pstmt.setString(5, LocalDateTimeUtils.formatDateTime(evento.getUpdatedAt()));
            pstmt.setString(6, evento.getTemplateId());
            pstmt.setString(7, evento.getId());

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows > 0) {
                System.out.println("Evento salvo com sucesso: " + evento.getNomeEvento());

                if (isJob) {
                    Integracao integracao = new Integracao();
                    integracao.setId(UUID.randomUUID().toString());
                    integracao.setTipo("U");
                    integracao.setConteudoJson(new Gson().toJson(evento));
                    integracao.setDataStamp(LocalDateTimeUtils.formatDateTime(null));
                    integracao.setServicoRest(String.format("%s/%s", API_EVENTO_URL, evento.getId()));
                    DBUtils.gravaRegistroIntegracao(integracao);
                }

                return evento;
            }

        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,"Erro ao atualizar eventos: " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(EventoDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return null;
    }

    public void removeAll() {
        String sql = "DELETE FROM eventos WHERE id = id";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.executeUpdate();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null,"Erro ao remover todos os eventos: " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(EventoDAO.class.getName()).log(Level.SEVERE, null, e);
        }
    }

    public List<Template> findTemplate() {
        List<Template> lista = new ArrayList<>();
        String sql = "SELECT * FROM Template";
        try (Connection conn = SQLiteConnection.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            try (java.sql.ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Template template = new Template();
                    template.setId(rs.getString("id"));
                    template.setNomeTemplate(rs.getString("nome"));
                    lista.add(template);
                }
            }

        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,"Erro ao localizae template: " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(EventoDAO.class.getName()).log(Level.SEVERE, null, e);
        }
        return lista;
    }

    public Template salvarTemplate(Template entity, boolean isJob) {
        String sql = null;

        if (isJob) {
            sql = "INSERT INTO Template (id, nome) VALUES (?, ?)";
        } else {
            sql = "INSERT OR REPLACE INTO Template (id, nome) VALUES (?, ?)";
        }

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, entity.getId());
            pstmt.setString(2, entity.getNomeTemplate());

            pstmt.executeUpdate();
            System.out.println("Template salvo com sucesso: " + entity.getNomeTemplate());

            return entity;
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,"Erro ao salvar template: " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(EventoDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return null;
    }

    public void removeAllTemplate() {
        String sql = "DELETE FROM Template WHERE id = id";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.executeUpdate();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null,"Erro ao remover todos os templates: " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(EventoDAO.class.getName()).log(Level.SEVERE, null, e);
        }
    }
}
