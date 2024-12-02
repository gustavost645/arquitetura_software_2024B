package br.com.gssoftwares.aulasegunda.utils;

import javax.swing.JDesktopPane;
import javax.swing.JInternalFrame;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class ViewUtils {

    public static void exibeInternalFrame(JDesktopPane desktopPane, Object tela) {
        JInternalFrame internalFrame = (JInternalFrame) tela; 
        desktopPane.add(internalFrame);

        centralizarTela(internalFrame,desktopPane);

        internalFrame.setVisible(true);
    }

    private static void centralizarTela(JInternalFrame internalFrame, JDesktopPane desktopPane) {
        // Centralizar o JInternalFrame
        int desktopWidth = desktopPane.getWidth();
        int desktopHeight = desktopPane.getHeight();
        int frameWidth = internalFrame.getWidth();
        int frameHeight = internalFrame.getHeight();

        int x = (desktopWidth - frameWidth) / 2;
        int y = (desktopHeight - frameHeight) / 2;
        internalFrame.setLocation(x, y);
    }
    
}
