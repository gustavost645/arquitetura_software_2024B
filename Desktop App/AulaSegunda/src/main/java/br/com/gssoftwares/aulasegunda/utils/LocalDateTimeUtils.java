/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package br.com.gssoftwares.aulasegunda.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 *
 * @author Gustavo Steinhoefel
 */
public class LocalDateTimeUtils {
    
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return formatDateTime(LocalDateTime.now());
        }

        return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
    
}
