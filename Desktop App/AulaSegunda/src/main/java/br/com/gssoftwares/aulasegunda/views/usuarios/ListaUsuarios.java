package br.com.gssoftwares.aulasegunda.views.usuarios;

import br.com.gssoftwares.aulasegunda.model.User;
import br.com.gssoftwares.aulasegunda.service.UsuarioService;
import br.com.gssoftwares.aulasegunda.utils.ViewUtils;
import java.util.List;
import javax.swing.JDesktopPane;
import javax.swing.JOptionPane;
import javax.swing.table.DefaultTableModel;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class ListaUsuarios extends javax.swing.JInternalFrame {

    private JDesktopPane desktopPane;

    private User selectedUser;
    private List<User> listaUsuarios;

    /**
     * Creates new form ListaUsuarios
     */
    public ListaUsuarios() {
        initComponents();
        init();
    }

    public ListaUsuarios(JDesktopPane desktopPaneTelaPrincipal) {
        this.desktopPane = desktopPaneTelaPrincipal;
        initComponents();
        init();
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jTable1 = new javax.swing.JTable();
        Novo = new javax.swing.JButton();
        Editar = new javax.swing.JButton();
        Excluir = new javax.swing.JButton();
        Fechar = new javax.swing.JButton();
        Novo1 = new javax.swing.JButton();

        setClosable(true);
        setTitle("Lista Usuários");

        jTable1.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Código", "Username", "Email"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                true, false, false
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        jTable1.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                jTable1MouseClicked(evt);
            }
        });
        jScrollPane1.setViewportView(jTable1);
        if (jTable1.getColumnModel().getColumnCount() > 0) {
            jTable1.getColumnModel().getColumn(0).setResizable(false);
            jTable1.getColumnModel().getColumn(0).setPreferredWidth(120);
            jTable1.getColumnModel().getColumn(1).setResizable(false);
            jTable1.getColumnModel().getColumn(1).setPreferredWidth(200);
            jTable1.getColumnModel().getColumn(2).setResizable(false);
            jTable1.getColumnModel().getColumn(2).setPreferredWidth(200);
        }

        Novo.setText("Novo");
        Novo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                NovoActionPerformed(evt);
            }
        });

        Editar.setText("Editar");
        Editar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                EditarActionPerformed(evt);
            }
        });

        Excluir.setText("Excluir");
        Excluir.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                ExcluirActionPerformed(evt);
            }
        });

        Fechar.setText("Fechar");
        Fechar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                FecharActionPerformed(evt);
            }
        });

        Novo1.setText("Recarregar");
        Novo1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Novo1ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 687, Short.MAX_VALUE)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(Novo1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(Novo)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(Editar)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(Excluir)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(Fechar)
                .addContainerGap())
        );

        layout.linkSize(javax.swing.SwingConstants.HORIZONTAL, new java.awt.Component[] {Editar, Excluir, Fechar, Novo, Novo1});

        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 461, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(Novo)
                    .addComponent(Editar)
                    .addComponent(Excluir)
                    .addComponent(Fechar)
                    .addComponent(Novo1))
                .addContainerGap())
        );

        layout.linkSize(javax.swing.SwingConstants.VERTICAL, new java.awt.Component[] {Editar, Excluir, Fechar, Novo, Novo1});

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void FecharActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_FecharActionPerformed
        dispose();
    }//GEN-LAST:event_FecharActionPerformed

    private void ExcluirActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_ExcluirActionPerformed
        int confirmacao = JOptionPane.showOptionDialog(this,
                "Você realmente deseja excluir este registro?",
                "Confirmar Exclusão",
                JOptionPane.YES_NO_OPTION,
                JOptionPane.QUESTION_MESSAGE,
                null,
                new Object[]{"Sim", "Não"},
                "Sim");

        if (confirmacao == 0) {
            int linha = jTable1.getSelectedRow();  // Obtém a linha selecionada
            if (linha != -1) {
                new UsuarioService().remove(listaUsuarios.get(linha));
                init();
            }
        }
    }//GEN-LAST:event_ExcluirActionPerformed

    private void NovoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_NovoActionPerformed
        ViewUtils.exibeInternalFrame(desktopPane, new CadastroUsuario());
        init();
    }//GEN-LAST:event_NovoActionPerformed

    private void jTable1MouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_jTable1MouseClicked
        int linha = jTable1.getSelectedRow();  // Obtém a linha selecionada
        if (linha != -1) {
            selectedUser = listaUsuarios.get(linha);
        }
    }//GEN-LAST:event_jTable1MouseClicked

    private void EditarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_EditarActionPerformed
        if(selectedUser != null){
            ViewUtils.exibeInternalFrame(desktopPane, new CadastroUsuario(selectedUser));
            init();
        }
    }//GEN-LAST:event_EditarActionPerformed

    private void Novo1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Novo1ActionPerformed
        init();
    }//GEN-LAST:event_Novo1ActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton Editar;
    private javax.swing.JButton Excluir;
    private javax.swing.JButton Fechar;
    private javax.swing.JButton Novo;
    private javax.swing.JButton Novo1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable jTable1;
    // End of variables declaration//GEN-END:variables

    private void init() {
        clearJTable();
        listaUsuarios = new UsuarioService().findAll();
        if (!listaUsuarios.isEmpty()) {

            // Definir os dados da tabela: Colunas e Linhas
            DefaultTableModel model = (DefaultTableModel) jTable1.getModel();

            // Preencher as linhas da tabela com os dados dos usuários
            for (User user : listaUsuarios) {
                Object[] rowData = {
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getLogradouro(),
                    user.getNumero(),
                    user.getBairro(),
                    user.getCidade()
                };
                model.addRow(rowData);
            }

        }

    }

    private void clearJTable() {
        DefaultTableModel m = (DefaultTableModel) jTable1.getModel();
        for (int a1 = m.getRowCount(); a1 > 0; --a1) {
            m.removeRow(a1 - 1);
        }
    }
}
