package br.com.gssoftwares.aulasegunda.rest;

import br.com.gssoftwares.aulasegunda.model.Integracao;
import br.com.gssoftwares.aulasegunda.service.IntegracaoService;
import com.google.gson.*;
import org.apache.hc.client5.http.classic.methods.HttpDelete;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.classic.methods.HttpPut;
import org.apache.hc.client5.http.classic.methods.HttpUriRequest;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;

public class RestServiceClient {

    private static final String API_TOKEN = "3e59d7bff259bf1bb5ba101700a27d3ab289575f6dbaa633aaa74dae0ff5b87e";

    private static final String API_AUTH_URL = "http://sage.gsoftwares.com.br:3001/auth/users";
    private static final String API_EVENTOS_URL = "http://sage.gsoftwares.com.br:3004/evento";
    private static final String API_INSCRICAO_URL = "http://sage.gsoftwares.com.br:3005/inscricao";

    public JsonArray buscarUsuarios() {
        try (CloseableHttpClient httpClient = HttpClients.custom().build()) { 
            HttpGet request = new HttpGet(API_AUTH_URL);
            request.setHeader("x-api-key", API_TOKEN);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getCode() != 200 && response.getCode() != 201) {
                    System.err.println("Erro ao chamar a API");
                    return null;
                }

                String responseBody = EntityUtils.toString(response.getEntity());

                JsonElement json = JsonParser.parseString(responseBody);
                return json.getAsJsonArray();
            }
        } catch (Exception e) {
            System.err.println("Erro ao chamar a API: " + e.getMessage());
            return null;
        }
    }

    public JsonArray buscarEventos() {
        try (CloseableHttpClient httpClient = HttpClients.custom().build()) {
            HttpGet request = new HttpGet(API_EVENTOS_URL + "/list");
            request.setHeader("x-api-key", API_TOKEN);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getCode() != 200 && response.getCode() != 201) {
                    System.err.println("Erro ao chamar a API");
                    return null;
                }

                String responseBody = EntityUtils.toString(response.getEntity());

                JsonElement json = JsonParser.parseString(responseBody);
                return json.getAsJsonArray();
            }
        } catch (Exception e) {
            System.err.println("Erro ao chamar a API: " + e.getMessage());
            return null;
        }
    }

    public JsonArray buscarInscricoes() {
        try (CloseableHttpClient httpClient = HttpClients.custom().build()) {
            HttpGet request = new HttpGet(API_INSCRICAO_URL + "/list");
            request.setHeader("x-api-key", API_TOKEN);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getCode() != 200 && response.getCode() != 201) {
                    System.err.println("Erro ao chamar a API");
                    return null;
                }

                String responseBody = EntityUtils.toString(response.getEntity());

                JsonElement json = JsonParser.parseString(responseBody);
                return json.getAsJsonArray();
            }
        } catch (Exception e) {
            System.err.println("Erro ao chamar a API: " + e.getMessage());
            return null;
        }
    }

    public void enviarInformacoes(Integracao entity) {

        // Verificar tipo da operação (CRUD)
        try (CloseableHttpClient httpClient = HttpClients.custom().build()) {
            // Definir o verbo HTTP com base no tipo (CRUD)
            HttpUriRequest request = null;
            String url = entity.getServicoRest();
            String jsonBody = entity.getConteudoJson();

            // Ajuste para os verbos HTTP
            switch (entity.getTipo().toUpperCase()) {
                case "C":
                    // CREATE -> POST
                    request = new HttpPost(url);
                    ((HttpPost) request).setEntity(new StringEntity(jsonBody));
                    break;
                case "R":
                    // READ -> GET
                    request = new HttpGet(url);
                    break;
                case "U":
                    // UPDATE -> PUT
                    request = new HttpPut(url);
                    ((HttpPut) request).setEntity(new StringEntity(jsonBody));
                    break;
                case "D":
                    // DELETE -> DELETE
                    request = new HttpDelete(url);
                    break;
                default:
                    System.err.println("Tipo de operação inválido");
                    return;
            }

            // Definir cabeçalhos necessários
            request.setHeader("x-api-key", API_TOKEN);
            request.setHeader("Content-Type", "application/json");

            // Enviar requisição e verificar resposta
            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getCode() == 200 || response.getCode() == 201) {
                    // Se a requisição foi bem-sucedida, atualize a entidade
                    System.out.println("Integração bem-sucedida!");

                    // Atualizar a entidade
                    new IntegracaoService().atualizarCampoIntegracao(entity);
                } else {
                    System.err.println("Erro ao chamar a API: " + response.getCode());
                }
            }

        } catch (Exception e) {
            System.err.println("Erro ao consumir a API: " + e.getMessage());
        }
    }

    public JsonArray buscarTemplate() {
        try (CloseableHttpClient httpClient = HttpClients.custom().build()) {
            HttpGet request = new HttpGet(API_EVENTOS_URL + "/template");
            request.setHeader("x-api-key", API_TOKEN);

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                if (response.getCode() != 200 && response.getCode() != 201) {
                    System.err.println("Erro ao chamar a API");
                    return null;
                }

                String responseBody = EntityUtils.toString(response.getEntity());

                JsonElement json = JsonParser.parseString(responseBody);
                return json.getAsJsonArray();
            }
        } catch (Exception e) {
            System.err.println("Erro ao chamar a API: " + e.getMessage());
            return null;
        }
    }
}
