package br.com.gssoftwares.aulasegunda.service;

import br.com.gssoftwares.aulasegunda.dao.EventoDAO;
import br.com.gssoftwares.aulasegunda.model.Evento;
import br.com.gssoftwares.aulasegunda.model.Template;
import br.com.gssoftwares.aulasegunda.rest.RestServiceClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.util.List;
import java.util.UUID;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class EventoService {

    EventoDAO dao = new EventoDAO();
    RestServiceClient restService = new RestServiceClient();

    public void sincronizarEventos() {

        JsonArray eventosJson = restService.buscarEventos();

        if (eventosJson != null) {
            dao.removeAll();
            for (int i = 0; i < eventosJson.size(); i++) {
                JsonObject eventoJson = eventosJson.get(i).getAsJsonObject();
                Evento entity = Evento.fromJsonObject(eventoJson);

                // Sincronizar o evento no banco de dados
                dao.salvarEvento(entity, false);

            }
        }
    }
    
    public void sincronizarTemplates() {
        JsonArray eventosJson = restService.buscarTemplate();
        if (eventosJson != null) {
            dao.removeAllTemplate();
            for (int i = 0; i < eventosJson.size(); i++) {
                JsonObject eventoJson = eventosJson.get(i).getAsJsonObject();
                Template entity = Template.fromJsonObject(eventoJson);

                // Sincronizar o evento no banco de dados
                dao.salvarTemplate(entity, false);

            }
        }
    }

    public List<Evento> findAll() {
        return dao.findAll();
    }
    
    public Evento salvarEvento(Evento evento){
        if(evento.getId() == null){
            evento.setId(UUID.randomUUID().toString());
        }
        return dao.salvarEvento(evento, true);
    }

    public Evento updateEvento(Evento evento) {
        return dao.updateEvento(evento, true);
    }

    public List<Template> findTemplate() {
        return dao.findTemplate();
    }

}
