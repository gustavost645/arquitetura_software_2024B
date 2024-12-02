package br.com.gssoftwares.aulasegunda.utils;

import br.com.gssoftwares.aulasegunda.db.SQLiteConnection;
import br.com.gssoftwares.aulasegunda.model.Integracao;
import br.com.gssoftwares.aulasegunda.service.EventoService;
import br.com.gssoftwares.aulasegunda.service.InscricaoService;
import br.com.gssoftwares.aulasegunda.service.IntegracaoService;
import br.com.gssoftwares.aulasegunda.service.UsuarioService;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class DBUtils {

    public static void criarTabelaUsuarios() {
        String sql = " CREATE TABLE IF NOT EXISTS usuarios ("
                    + "id TEXT PRIMARY KEY, "
                    + "username TEXT NOT NULL, "
                    + "email TEXT NOT NULL UNIQUE, "
                    + "password TEXT NOT NULL, "
                    + "logradouro TEXT, "
                    + "numero TEXT, "
                    + "bairro TEXT, "
                    + "cidade TEXT, "
                    + "createdAt TEXT, "
                    + "updatedAt TEXT);";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.execute();
        } catch (SQLException e) {
            System.err.println("Erro ao criar tabela: " + e.getMessage());
        }
    }

    public static void criarTabelaEventos() {
        String sql = " CREATE TABLE IF NOT EXISTS eventos (\n"
                + "    id TEXT PRIMARY KEY,\n"
                + "    nomeEvento TEXT NOT NULL,\n"
                + "    descricaoEvento TEXT,\n"
                + "    cargaHoraria REAL NOT NULL,\n"
                + "    createdAt TEXT,\n"
                + "    updatedAt TEXT\n"
                + ");";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.execute();
        } catch (SQLException e) {
            System.err.println("Erro ao criar tabela: " + e.getMessage());
        }
    }

    public static void criarTabelaInscricoes() {
        String sql = " CREATE TABLE IF NOT EXISTS Inscricao (\n"
                + "    id TEXT PRIMARY KEY,\n"
                + "    usuarioId TEXT NOT NULL,\n"
                + "    eventoId TEXT NOT NULL,\n"
                + "    presente BOOLEAN NOT NULL DEFAULT 0,\n"
                + "    createdAt TEXT NOT NULL,\n"
                + "    updatedAt TEXT NOT NULL\n"
                + ");";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.execute();
        } catch (SQLException e) {
            System.err.println("Erro ao criar tabela: " + e.getMessage());
        }
    }

    public static void crarTabelaIntegracoes() {
        String sql = " CREATE TABLE IF NOT EXISTS integracao (\n"
                + "    id UUID PRIMARY KEY,"
                + "    tipo CHAR(1),"
                + "    conteudo TEXT,"
                + "    servico_rest VARCHAR(255),"
                + "    data_stamp DATETIME,"
                + "    integracao BOOLEAN "
                + ");";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.execute();
        } catch (SQLException e) {
            System.err.println("Erro ao criar tabela: " + e.getMessage());
        }
    }

    public static void receberDados() {
        new UsuarioService().sincronizarUsuarios();
        new EventoService().sincronizarEventos();
        new EventoService().sincronizarTemplates();
        new InscricaoService().sincronizarIncricoes();
    }

    public static void gravaRegistroIntegracao(Integracao integracao) {
        String sqlIntegracao = "INSERT INTO integracao (id, tipo, conteudo, servico_rest, data_stamp, integracao) "
                + "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = SQLiteConnection.connect(); PreparedStatement pstmtIntegracao = conn.prepareStatement(sqlIntegracao)) {
            pstmtIntegracao.setString(1, integracao.getId());
            pstmtIntegracao.setString(2, integracao.getTipo());
            pstmtIntegracao.setString(3, integracao.getConteudoJson());
            pstmtIntegracao.setString(4, integracao.getServicoRest());
            pstmtIntegracao.setString(5, integracao.getDataStamp());
            pstmtIntegracao.setBoolean(6, false);

            pstmtIntegracao.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Erro ao criar tabela: " + e.getMessage());
        }
    }

    public static void enviaDados() {
        new IntegracaoService().enviarInformacoes();
    }

}
