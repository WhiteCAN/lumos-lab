package com.lumos.lab.concept.grpc;

import com.lumos.lab.grpc.proto.GrpcConceptResponse;
import java.util.List;

public record GrpcExplainResponse(
        String concept,
        String summary,
        String transport,
        List<String> steps,
        String serverThread,
        String handledAt
) {
    public static GrpcExplainResponse from(GrpcConceptResponse response) {
        return new GrpcExplainResponse(
                response.getConcept(),
                response.getSummary(),
                response.getTransport(),
                response.getStepsList(),
                response.getServerThread(),
                response.getHandledAt()
        );
    }
}
