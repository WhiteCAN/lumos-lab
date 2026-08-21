package com.lumos.lab.concept.grpc;

import com.lumos.lab.grpc.proto.ConceptServiceGrpc;
import com.lumos.lab.grpc.proto.GrpcConceptRequest;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GrpcConceptClientService {

    private final ManagedChannel channel;
    private final ConceptServiceGrpc.ConceptServiceBlockingStub blockingStub;

    public GrpcConceptClientService(
            @Value("${grpc.client.host:localhost}") String host,
            @Value("${grpc.client.port:9090}") int port
    ) {
        this.channel = ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext()
                .build();
        this.blockingStub = ConceptServiceGrpc.newBlockingStub(channel);
    }

    public GrpcExplainResponse explain(String keyword) {
        GrpcConceptRequest request = GrpcConceptRequest.newBuilder()
                .setKeyword(keyword)
                .build();
        return GrpcExplainResponse.from(blockingStub.explain(request));
    }

    @PreDestroy
    public void shutdown() {
        channel.shutdownNow();
    }
}
