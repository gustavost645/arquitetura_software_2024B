package br.com.gssoftwares.aulasegunda.db;

/**
 *
 * @author Gustavo Steinhoefel
 */
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SQLiteConnection {
    private static final String DATABASE_URL = "jdbc:sqlite:eventos.db";

    public static Connection connect() {
        try {
            return DriverManager.getConnection(DATABASE_URL);
        } catch (SQLException e) {
            System.err.println("Erro ao conectar ao SQLite: " + e.getMessage());
            return null;
        }
    }
}

