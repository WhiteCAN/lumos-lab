package com.lumos.lab.pattern.book;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import java.net.URI;
import java.net.http.*;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT,properties="grpc.server.enabled=false")
class BookPatternHttpTest {
    @LocalServerPort int port;
    private HttpResponse<String> call(String slug, int count) throws Exception {
        return HttpClient.newHttpClient().send(HttpRequest.newBuilder(URI.create("http://localhost:"+port+"/api/patterns/book/"+slug))
                .header("Content-Type","application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"text\":\"Hello\",\"count\":"+count+",\"value\":3,\"seed\":42,\"fail\":false}"))
                .build(),HttpResponse.BodyHandlers.ofString());
    }
    @Test void knownPatternRunsAndUnknownPatternIsRejected() throws Exception {
        assertThat(call("adapter",2).statusCode()).isEqualTo(200);
        assertThat(call("not-a-pattern",2).statusCode()).isEqualTo(400);
    }
    @Test void requestsCannotExceedExecutionLimits() throws Exception {
        assertThat(call("adapter",0).statusCode()).isEqualTo(400);
        assertThat(call("adapter",21).statusCode()).isEqualTo(400);
    }
}
