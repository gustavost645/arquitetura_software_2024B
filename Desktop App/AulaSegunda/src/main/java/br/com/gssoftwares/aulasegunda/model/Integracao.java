
package br.com.gssoftwares.aulasegunda.model;

/**
 *
 * @author Gustavo Steinhoefel
 */

public class Integracao {
    
    private String id;
    private String tipo;
    private String conteudoJson;
    private String dataStamp;
    private String servicoRest;
    private boolean integracao;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getConteudoJson() {
        return conteudoJson;
    }

    public void setConteudoJson(String conteudoJson) {
        this.conteudoJson = conteudoJson;
    }

    public String getDataStamp() {
        return dataStamp;
    }

    public void setDataStamp(String dataStamp) {
        this.dataStamp = dataStamp;
    }

    public String getServicoRest() {
        return servicoRest;
    }

    public void setServicoRest(String servicoRest) {
        this.servicoRest = servicoRest;
    }
    
    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public boolean isIntegracao() {
        return integracao;
    }

    public void setIntegracao(boolean integracao) {
        this.integracao = integracao;
    }

    
    
}

