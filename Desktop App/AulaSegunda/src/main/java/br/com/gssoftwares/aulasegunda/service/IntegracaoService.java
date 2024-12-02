
package br.com.gssoftwares.aulasegunda.service;

import br.com.gssoftwares.aulasegunda.dao.IntegracaoDAO;
import br.com.gssoftwares.aulasegunda.model.Integracao;
import br.com.gssoftwares.aulasegunda.rest.RestServiceClient;
import java.util.List;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class IntegracaoService {

    IntegracaoDAO dao = new IntegracaoDAO();
    RestServiceClient restService = new RestServiceClient();
    
    public void enviarInformacoes(){
        List<Integracao> lista = findListIntegracaoNaoProcessados();
        if(!lista.isEmpty()){
            for(Integracao i : lista){
                try{
                    restService.enviarInformacoes(i);
                }catch(Exception e){
                    System.err.println("Erro ao sincronizar evento: " + e.getMessage());
                }
            }
        }
    }
    
    public List<Integracao> findListIntegracaoNaoProcessados() {
        return dao.findListIntegracaoNaoProcessados();
    }

    public void atualizarCampoIntegracao(Integracao entity) {
        dao.atualizarCampoIntegracao(entity);
    }
    
    
}
