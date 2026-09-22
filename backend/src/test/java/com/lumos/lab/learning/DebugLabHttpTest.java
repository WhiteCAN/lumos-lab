package com.lumos.lab.learning;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import java.net.URI;
import java.net.http.*;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties={"app.cors.allowed-origins=http://localhost:3189", "grpc.server.enabled=false"})
class DebugLabHttpTest {
    @LocalServerPort int port;
    final HttpClient client = HttpClient.newHttpClient();
    private HttpResponse<String> post(String route, String json) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://localhost:"+port+"/api/labs/"+route))
                .header("Content-Type","application/json").POST(HttpRequest.BodyPublishers.ofString(json)).build(),
                HttpResponse.BodyHandlers.ofString());
    }
    @Test void requestValidationRejectsInvalidMapAndUnboundedDelay() throws Exception {
        assertThat(post("ordered-maps","{\"keys\":[],\"accessKey\":1,\"boundary\":1}").statusCode()).isEqualTo(400);
        assertThat(post("task","{\"name\":\"test\",\"delayMs\":100000}").statusCode()).isEqualTo(400);
        assertThat(post("ordered-maps","{\"keys\":[null]}").statusCode()).isEqualTo(400);
    }
    @Test void actualStatusAndBeanIdentityReachClient() throws Exception {
        assertThat(post("http","{\"status\":409}").statusCode()).isEqualTo(409);
        assertThat(post("http","{\"status\":999}").statusCode()).isEqualTo(400);
        assertThat(post("beans","{}").body()).contains("\"sameInstance\":true", "\"sameAsInjected\":true");
    }
    @Test void allowedAndDeniedPreflightAreDifferent() throws Exception {
        for (String origin : new String[]{"http://localhost:3189","https://not-allowed.example"}) {
            var request=HttpRequest.newBuilder(URI.create("http://localhost:"+port+"/api/labs/cors"))
                    .header("Origin",origin).header("Access-Control-Request-Method","POST")
                    .header("Access-Control-Request-Headers","content-type")
                    .method("OPTIONS",HttpRequest.BodyPublishers.noBody()).build();
            var response=client.send(request,HttpResponse.BodyHandlers.ofString());
            assertThat(response.statusCode()).isEqualTo(origin.contains("localhost") ? 200 : 403);
            assertThat(response.headers().firstValue("Access-Control-Allow-Origin").orElse(""))
                    .isEqualTo(origin.contains("localhost") ? origin : "");
        }
    }
}
