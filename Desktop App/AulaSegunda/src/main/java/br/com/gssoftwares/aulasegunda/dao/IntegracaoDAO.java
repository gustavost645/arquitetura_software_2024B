
package br.com.gssoftwares.aulasegunda.dao;

import br.com.gssoftwares.aulasegunda.db.SQLiteConnection;
import br.com.gssoftwares.aulasegunda.model.Integracao;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class IntegracaoDAO {

    public List<Integracao> findListIntegracaoNaoProcessados() {
        List<Integracao> listaIntegracao = new ArrayList<>();
        String sql = " SELECT" +
                     "	i.id," +
                     "	i.tipo," +
                     "	i.conteudo," +
                     "	i.servico_rest," +
                     "	i.integracao" +
                     " FROM" +
                     "	integracao i" +
                     " WHERE" +
                     "	i.integracao = 0" + 
                     " ORDER BY i.data_stamp asc";

        try (Connection conn = SQLiteConnection.connect(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                // Recuperar os dados da consulta
                Integracao e = new Integracao();
                e.setId(rs.getString("id"));
                e.setTipo(rs.getString("tipo"));
                e.setConteudoJson(rs.getString("conteudo"));
                e.setServicoRest(rs.getString("servico_rest"));
                e.setIntegracao(rs.getBoolean("integracao"));

                listaIntegracao.add(e);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null,"Erro : " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(IntegracaoDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return listaIntegracao;
    }

    public Integracao atualizarCampoIntegracao(Integracao entity) {
        String sql = "UPDATE integracao SET integracao=? where id= ?";
        
        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setBoolean(1, true);
            pstmt.setString(2, entity.getId());

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows > 0) {
                System.out.println("Integracao salva com sucesso: " + entity.getId());

                return entity;
            }

        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null,"Erro : " + e.getMessage() , "ERRO", JOptionPane.ERROR_MESSAGE);
            Logger.getLogger(IntegracaoDAO.class.getName()).log(Level.SEVERE, null, e);
        }

        return null;
    }
    
}
