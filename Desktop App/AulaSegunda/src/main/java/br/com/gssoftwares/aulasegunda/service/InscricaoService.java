package br.com.gssoftwares.aulasegunda.service;

import br.com.gssoftwares.aulasegunda.dao.InscricaoDAO;
import br.com.gssoftwares.aulasegunda.model.Evento;
import br.com.gssoftwares.aulasegunda.model.Inscricao;
import br.com.gssoftwares.aulasegunda.rest.RestServiceClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class InscricaoService {

    InscricaoDAO dao = new InscricaoDAO();
    RestServiceClient rest = new RestServiceClient();

    public void sincronizarIncricoes() {

        JsonArray returnJson = rest.buscarInscricoes();

        if (returnJson != null) {
            dao.removeAll();
            for (int i = 0; i < returnJson.size(); i++) {
                JsonObject eventoJson = returnJson.get(i).getAsJsonObject();
                Inscricao entity = Inscricao.fromJsonObject(eventoJson);

                // Sincronizar o evento no banco de dados
                dao.salvarInscricao(entity, false);
            }
        }
    }

    public Inscricao salvarUsuario(Inscricao entity) {
        if(entity.getId() == null){
            entity.setId(UUID.randomUUID().toString());
        }
        
        return dao.salvarInscricao(entity, true);
    }

    public void remove(Inscricao entity) {
        dao.remove(entity, true);
    }

    public List<Inscricao> findAll() {
        return dao.findAll();
    }

    public List<Inscricao> findByEvento(Evento evento) {
        return dao.findByEvento(evento);
    }

    public void removeUserByEvento(Inscricao inscricao) {
        dao.remove(inscricao, true);
    }

    public void inserirInscricao(Inscricao inscricao) {
        dao.inserirInscricao(inscricao);
    }

    public void updateInscricao(Inscricao inscricao) {
        List<Inscricao> lista = findByEvento(new Evento(inscricao.getEventoId()));
        if (!lista.isEmpty()) {
            Optional<Inscricao> inscricaoSelecionada = lista.stream()
                    .filter(e -> e.getUsuarioId().equals(inscricao.getUsuarioId()))
                    .findFirst();

            if (inscricaoSelecionada.isPresent()) {
                Inscricao inscricaoDb = inscricaoSelecionada.get();
                inscricaoDb.setUsuarioId(inscricao.getUsuarioId());
                inscricaoDb.setPresente(inscricao.isPresente());
                dao.updateInscricao(inscricaoDb, true);
            }
        }
    }
}
