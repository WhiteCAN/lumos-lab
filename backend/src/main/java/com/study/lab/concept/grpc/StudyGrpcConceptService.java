package com.study.lab.concept.grpc;

import com.study.lab.grpc.proto.ConceptServiceGrpc;
import com.study.lab.grpc.proto.GrpcConceptRequest;
import com.study.lab.grpc.proto.GrpcConceptResponse;
import io.grpc.stub.StreamObserver;
import java.time.Instant;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class StudyGrpcConceptService extends ConceptServiceGrpc.ConceptServiceImplBase {

    @Override
    public void explain(GrpcConceptRequest request, StreamObserver<GrpcConceptResponse> responseObserver) {
        String keyword = request.getKeyword().trim();
        ConceptExplanation explanation = explain(keyword);

        GrpcConceptResponse response = GrpcConceptResponse.newBuilder()
                .setConcept(explanation.concept())
                .setSummary(explanation.summary())
                .setTransport("HTTP/2 + Protocol Buffers")
                .addSteps("Next.js 화면에서 Spring REST API를 호출합니다.")
                .addSteps("Spring Controller가 내부 gRPC 클라이언트를 호출합니다.")
                .addSteps("gRPC 클라이언트가 localhost:9090의 gRPC 서버에 protobuf 메시지를 보냅니다.")
                .addSteps("gRPC 서버가 응답을 만들고 REST 응답으로 다시 변환됩니다.")
                .setServerThread(Thread.currentThread().getName())
                .setHandledAt(Instant.now().toString())
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    private ConceptExplanation explain(String keyword) {
        String normalized = keyword.toLowerCase(Locale.ROOT);

        if (normalized.contains("rest")) {
            return new ConceptExplanation(
                    "REST API",
                    "리소스를 URL로 표현하고 HTTP 메서드로 행위를 표현하는 웹 API 스타일입니다."
            );
        }
        if (normalized.contains("transaction") || normalized.contains("트랜잭")) {
            return new ConceptExplanation(
                    "@Transactional",
                    "하나의 작업 단위를 트랜잭션으로 묶어 성공 시 커밋하고 실패 시 롤백하도록 관리합니다."
            );
        }
        if (normalized.contains("async") || normalized.contains("비동기")) {
            return new ConceptExplanation(
                    "비동기",
                    "작업 완료를 기다리며 멈추지 않고 다른 작업을 진행한 뒤 결과를 나중에 합치는 실행 방식입니다."
            );
        }
        return new ConceptExplanation(
                "gRPC",
                "Protocol Buffers로 계약을 정의하고 HTTP/2 위에서 빠르게 RPC를 호출하는 통신 방식입니다."
        );
    }

    private record ConceptExplanation(String concept, String summary) {
    }
}
