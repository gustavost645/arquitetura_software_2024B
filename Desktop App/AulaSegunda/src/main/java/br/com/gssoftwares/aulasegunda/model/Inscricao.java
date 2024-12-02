package br.com.gssoftwares.aulasegunda.model;

import com.google.gson.JsonObject;
import java.time.LocalDateTime;
import java.util.UUID;

public class Inscricao {

    private String id;
    private String usuarioId;
    private String eventoId;
    private boolean presente;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    //transient
    private String nomeAluno;

    // Construtor padrão
    public Inscricao() {}

    // Construtor com parâmetros
    public Inscricao(String usuarioId, String eventoId, boolean presente) {
        this.id = UUID.randomUUID().toString();
        this.usuarioId = usuarioId;
        this.eventoId = eventoId;
        this.presente = presente;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters e setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getEventoId() {
        return eventoId;
    }

    public void setEventoId(String eventoId) {
        this.eventoId = eventoId;
    }

    public boolean isPresente() {
        return presente;
    }

    public void setPresente(boolean presente) {
        this.presente = presente;
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
    
    public String getNomeAluno() {
        return nomeAluno;
    }

    public void setNomeAluno(String nomeAluno) {
        this.nomeAluno = nomeAluno;
    }
 
    public static Inscricao fromJsonObject(JsonObject json) {
        Inscricao inscricao = new Inscricao();
        inscricao.setId(json.has("id") ? json.get("id").getAsString() : UUID.randomUUID().toString());
        inscricao.setUsuarioId(json.has("usuarioId") ? json.get("usuarioId").getAsString() : null);
        inscricao.setEventoId(json.has("eventoId") ? json.get("eventoId").getAsString() : null);
        inscricao.setPresente(json.has("presente") ? json.get("presente").getAsBoolean() : false);
        inscricao.setCreatedAt(null);
        inscricao.setUpdatedAt(null);
        return inscricao;
    }

}
