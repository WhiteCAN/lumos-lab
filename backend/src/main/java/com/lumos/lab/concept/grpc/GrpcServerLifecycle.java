package com.lumos.lab.concept.grpc;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.SmartLifecycle;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "grpc.server.enabled", havingValue = "true", matchIfMissing = true)
public class GrpcServerLifecycle implements SmartLifecycle {

    private final LumosGrpcConceptService conceptService;
    private final int port;
    private Server server;
    private boolean running;

    public GrpcServerLifecycle(
            LumosGrpcConceptService conceptService,
            @Value("${grpc.server.port:9090}") int port
    ) {
        this.conceptService = conceptService;
        this.port = port;
    }

    @Override
    public void start() {
        try {
            server = ServerBuilder.forPort(port)
                    .addService(conceptService)
                    .build()
                    .start();
            running = true;
        } catch (IOException exception) {
            throw new IllegalStateException("gRPC 서버 시작 실패: " + port, exception);
        }
    }

    @Override
    public void stop() {
        if (server != null) {
            server.shutdown();
        }
        running = false;
    }

    @Override
    public boolean isRunning() {
        return running;
    }
}
