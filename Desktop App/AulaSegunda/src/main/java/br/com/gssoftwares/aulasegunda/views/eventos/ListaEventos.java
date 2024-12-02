package br.com.gssoftwares.aulasegunda.views.eventos;

import br.com.gssoftwares.aulasegunda.model.Evento;
import br.com.gssoftwares.aulasegunda.service.EventoService;
import br.com.gssoftwares.aulasegunda.utils.ViewUtils;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JDesktopPane;
import javax.swing.JOptionPane;
import javax.swing.table.DefaultTableModel;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class ListaEventos extends javax.swing.JInternalFrame {

    private JDesktopPane desktopPane;

    private Evento selectedEvento;
    private List<Evento> listaEventos;

    /**
     * Creates new form ListaUsuarios
     */
    public ListaEventos() {
        initComponents();
        init();
    }

    public ListaEventos(JDesktopPane desktopPaneTelaPrincipal) {
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
        Inscricao = new javax.swing.JButton();
        Fechar = new javax.swing.JButton();
        recarrgar = new javax.swing.JButton();
        novo = new javax.swing.JButton();

        setClosable(true);
        setTitle("Lista Eventos");

        jTable1.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Código", "Evento"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                true, false
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
            jTable1.getColumnModel().getColumn(0).setPreferredWidth(195);
            jTable1.getColumnModel().getColumn(1).setResizable(false);
            jTable1.getColumnModel().getColumn(1).setPreferredWidth(500);
        }

        Inscricao.setText("Inscrição");
        Inscricao.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                InscricaoActionPerformed(evt);
            }
        });

        Fechar.setText("Fechar");
        Fechar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                FecharActionPerformed(evt);
            }
        });

        recarrgar.setText("Recarregar");
        recarrgar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                recarrgarActionPerformed(evt);
            }
        });

        novo.setText("Novo Evento");
        novo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                novoActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 687, Short.MAX_VALUE)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(recarrgar)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(Inscricao)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(novo)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(Fechar)
                .addContainerGap())
        );

        layout.linkSize(javax.swing.SwingConstants.HORIZONTAL, new java.awt.Component[] {Fechar, Inscricao, recarrgar});

        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 461, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(Inscricao)
                    .addComponent(Fechar)
                    .addComponent(recarrgar)
                    .addComponent(novo))
                .addContainerGap())
        );

        layout.linkSize(javax.swing.SwingConstants.VERTICAL, new java.awt.Component[] {Fechar, Inscricao, recarrgar});

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void FecharActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_FecharActionPerformed
        dispose();
    }//GEN-LAST:event_FecharActionPerformed

    private void jTable1MouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_jTable1MouseClicked
        int linha = jTable1.getSelectedRow();
        if (linha != -1) {
            selectedEvento = listaEventos.get(linha);
        }
    }//GEN-LAST:event_jTable1MouseClicked

    private void InscricaoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_InscricaoActionPerformed
        if (selectedEvento != null) {
            ViewUtils.exibeInternalFrame(desktopPane, new CadastroEventos(desktopPane, selectedEvento));
            init();
        } else {
            JOptionPane.showMessageDialog(null, "Selecione primeiramente uma linha para fazer a inscrição.", "INFO", JOptionPane.INFORMATION_MESSAGE);
            //Logger.getLogger(ListaEventos.class.getName()).log(Level.SEVERE, null, ex);
        }
    }//GEN-LAST:event_InscricaoActionPerformed

    private void recarrgarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_recarrgarActionPerformed
        init();
    }//GEN-LAST:event_recarrgarActionPerformed

    private void novoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_novoActionPerformed
        ViewUtils.exibeInternalFrame(desktopPane, new CadastroEventos(desktopPane));
        init();
    }//GEN-LAST:event_novoActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton Fechar;
    private javax.swing.JButton Inscricao;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable jTable1;
    private javax.swing.JButton novo;
    private javax.swing.JButton recarrgar;
    // End of variables declaration//GEN-END:variables

    private void init() {
        clearJTable();
        listaEventos = new EventoService().findAll();
        if (!listaEventos.isEmpty()) {

            // Definir os dados da tabela: Colunas e Linhas
            DefaultTableModel model = (DefaultTableModel) jTable1.getModel();

            // Preencher as linhas da tabela com os dados dos usuários
            for (Evento evento : listaEventos) {
                Object[] rowData = {
                    evento.getId(),
                    evento.getNomeEvento(),};
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
