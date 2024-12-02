
package br.com.gssoftwares.aulasegunda.model;

/**
 *
 * @author Gustavo Steinhoefel
 */
import com.google.gson.JsonObject;
import java.time.LocalDateTime;

public class Evento {
    private String id;
    private String nomeEvento;
    private String descricaoEvento;
    private float cargaHoraria;
    private String templateId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Evento(){
        
    }

    public Evento(String eventoId) {
        this.id = eventoId;
    }

    // Getters e Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNomeEvento() {
        return nomeEvento;
    }

    public void setNomeEvento(String nomeEvento) {
        this.nomeEvento = nomeEvento;
    }

    public String getDescricaoEvento() {
        return descricaoEvento;
    }

    public void setDescricaoEvento(String descricaoEvento) {
        this.descricaoEvento = descricaoEvento;
    }

    public float getCargaHoraria() {
        return cargaHoraria;
    }

    public void setCargaHoraria(float cargaHoraria) {
        this.cargaHoraria = cargaHoraria;
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

    

    // Método para converter JSON para Evento
    public static Evento fromJsonObject(JsonObject jsonObject) {
        Evento evento = new Evento();
        evento.setId(jsonObject.get("id").getAsString());
        evento.setNomeEvento(jsonObject.get("nomeEvento").getAsString());
        evento.setDescricaoEvento(jsonObject.has("descricaoEvento") ? jsonObject.get("descricaoEvento").getAsString() : null);
        evento.setCargaHoraria(jsonObject.get("cargaHoraria").getAsFloat());
        evento.setTemplateId(jsonObject.get("templateId").getAsString());
        evento.setCreatedAt(null);
        evento.setUpdatedAt(null);
        return evento;
    }
    
    @Override
    public String toString() {
        return nomeEvento; // Isso será exibido no JComboBox
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }
    
    
}

