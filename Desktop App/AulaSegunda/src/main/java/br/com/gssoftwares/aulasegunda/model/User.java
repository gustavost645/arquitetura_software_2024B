package br.com.gssoftwares.aulasegunda.model;

import com.google.gson.JsonObject;
import java.time.LocalDateTime;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class User {
    
    private String id;
    private String username;
    private String email;
    private String password;
    private String logradouro;
    private String numero;
    private String bairro;
    private String cidade;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Construtor
    public User(String id, String username, String email, String password, String logradouro,
                String numero, String bairro, String cidade, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.logradouro = logradouro;
        this.numero = numero;
        this.bairro = bairro;
        this.cidade = cidade;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public User() {}

    // Getters e Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getLogradouro() {
        return logradouro;
    }

    public void setLogradouro(String logradouro) {
        this.logradouro = logradouro;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Método utilitário para criar um User a partir de um JsonObject
    public static User fromJsonObject(JsonObject json) {
        return new User(
            json.get("id").getAsString(),
            json.get("username").getAsString(),
            json.get("email").getAsString(),
            json.has("password") ? json.get("password").getAsString() : null,
            json.has("logradouro") ? json.get("logradouro").getAsString() : null,
            json.has("numero") ? json.get("numero").getAsString() : null,
            json.has("bairro") ? json.get("bairro").getAsString() : null,
            json.has("cidade") ? json.get("cidade").getAsString() : null,
            null,
            null
        );
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", logradouro='" + logradouro + '\'' +
                ", numero='" + numero + '\'' +
                ", bairro='" + bairro + '\'' +
                ", cidade='" + cidade + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}

