
package br.com.gssoftwares.aulasegunda.model;

import com.google.gson.JsonObject;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class Template {

    
    private String id;
    private String nomeTemplate;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNomeTemplate() {
        return nomeTemplate;
    }

    public void setNomeTemplate(String nomeTemplate) {
        this.nomeTemplate = nomeTemplate;
    }
    
    public static Template fromJsonObject(JsonObject jsonObject) {
        Template evento = new Template();
        evento.setId(jsonObject.get("id").getAsString());
        evento.setNomeTemplate(jsonObject.get("nome").getAsString());
        return evento;
    }
}
