package br.com.gssoftwares.aulasegunda;

import br.com.gssoftwares.aulasegunda.service.UsuarioService;
import br.com.gssoftwares.aulasegunda.utils.DBUtils;

public class AulaSegunda {

    public static void main(String[] args) {

        UsuarioService userService = new UsuarioService();

        // Criar tabela se não existir
        DBUtils.criarTabelaUsuarios();
        DBUtils.criarTabelaEventos();
        DBUtils.criarTabelaInscricoes();
        DBUtils.crarTabelaIntegracoes();
        
        
        // executar o service para buscarUsuarios
        userService.sincronizarUsuarios();
        
        new TelaPrincipal().setVisible(true);
        
    }

}
