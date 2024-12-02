package br.com.gssoftwares.aulasegunda.service;

import br.com.gssoftwares.aulasegunda.dao.UsuarioDAO;
import br.com.gssoftwares.aulasegunda.model.User;
import br.com.gssoftwares.aulasegunda.rest.RestServiceClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.util.List;
import java.util.UUID;
import org.mindrot.jbcrypt.BCrypt;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class UsuarioService {
    UsuarioDAO usuarioDao = new UsuarioDAO();
    RestServiceClient restServiceClient = new RestServiceClient();
    
    public void sincronizarUsuarios() {

        JsonArray returnJson = restServiceClient.buscarUsuarios();

        if (returnJson != null) {
            usuarioDao.removeAll();
            for (int i = 0; i < returnJson.size(); i++) {
                JsonObject eventoJson = returnJson.get(i).getAsJsonObject();
                User usuario = User.fromJsonObject(eventoJson);

                // Sincronizar o evento no banco de dados
                usuarioDao.salvarUsuario(usuario,false);
            }
        }
    }

    public User salvarUsuario(User user) {
        String senha = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(10));
        user.setPassword(senha);
        
        if(user.getId() != null){
            return usuarioDao.updateUsuario(user,true);
        }else{
            user.setId(UUID.randomUUID().toString());
            return usuarioDao.salvarUsuario(user,true);
        }
    }


    public List<User> findAll() {
        return usuarioDao.findAll();
    }

    public void remove(User entity) {
        usuarioDao.remove(entity,true);
    }
    
}
