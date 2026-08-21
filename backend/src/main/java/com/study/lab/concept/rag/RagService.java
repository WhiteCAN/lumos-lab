package com.study.lab.concept.rag;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RagService {
    private final AtomicInteger idGenerator = new AtomicInteger();
    private final CopyOnWriteArrayList<StoredDocument> documents = new CopyOnWriteArrayList<>();

    public RagService() {
        addSeed("RAG 기본 흐름", "study-lab://rag/concepts",
                "RAG는 질문을 임베딩으로 바꾼 뒤 벡터 DB에서 관련 문서 조각을 검색하고, 검색된 컨텍스트를 LLM 프롬프트에 넣어 답변합니다. 출처와 근거를 함께 보여줄 수 있습니다.");
        addSeed("Chunking 설계", "study-lab://rag/chunking",
                "문서는 너무 크면 검색 품질이 떨어지므로 적당한 크기의 chunk로 나눕니다. chunk가 너무 작으면 맥락이 부족하고, 너무 크면 불필요한 정보가 많이 섞입니다.");
        addSeed("Vector Search", "study-lab://rag/vector-search",
                "벡터 검색은 문장 의미를 숫자 배열로 표현한 embedding 간 유사도를 비교합니다. 실제 서비스에서는 cosine similarity, topK, reranking, metadata filter를 함께 고려합니다.");
    }

    public List<RagDocumentResponse> documents() {
        return documents.stream()
                .map(document -> toResponse(document, List.of("인메모리 문서 저장소에서 등록된 문서를 조회합니다.")))
                .toList();
    }

    public RagDocumentResponse addDocument(RagDocumentRequest request) {
        StoredDocument document = createDocument(request.title().trim(), request.normalizedSource(), request.content().trim());
        documents.add(document);
        return toResponse(document, List.of(
                "문서 제목과 본문을 입력받습니다.",
                "본문을 학습용 chunk로 나눕니다.",
                "각 chunk에서 keyword를 뽑아 mock embedding처럼 사용합니다.",
                "인메모리 저장소에 문서와 chunk를 저장합니다."
        ));
    }

    public List<RagDocumentResponse> resetDocuments() {
        documents.clear();
        idGenerator.set(0);
        addSeed("RAG 기본 흐름", "study-lab://rag/concepts",
                "RAG는 질문을 임베딩으로 바꾼 뒤 벡터 DB에서 관련 문서 조각을 검색하고, 검색된 컨텍스트를 LLM 프롬프트에 넣어 답변합니다. 출처와 근거를 함께 보여줄 수 있습니다.");
        addSeed("Chunking 설계", "study-lab://rag/chunking",
                "문서는 너무 크면 검색 품질이 떨어지므로 적당한 크기의 chunk로 나눕니다. chunk가 너무 작으면 맥락이 부족하고, 너무 크면 불필요한 정보가 많이 섞입니다.");
        addSeed("Vector Search", "study-lab://rag/vector-search",
                "벡터 검색은 문장 의미를 숫자 배열로 표현한 embedding 간 유사도를 비교합니다. 실제 서비스에서는 cosine similarity, topK, reranking, metadata filter를 함께 고려합니다.");
        return documents();
    }

    public RagSearchResponse search(RagSearchRequest request) {
        List<String> queryKeywords = keywords(request.query());
        int topK = request.normalizedTopK();
        List<RagSearchHit> hits = documents.stream()
                .flatMap(document -> document.chunks().stream()
                        .map(chunk -> toHit(document, chunk, queryKeywords)))
                .filter(hit -> hit.score() > 0)
                .sorted(Comparator.comparingDouble(RagSearchHit::score).reversed())
                .limit(topK)
                .toList();

        return new RagSearchResponse(
                request.query(),
                topK,
                queryKeywords,
                hits,
                List.of(
                        "질문 문자열에서 keyword를 뽑아 query embedding처럼 사용합니다.",
                        "저장된 모든 chunk의 keyword와 겹치는 정도를 계산합니다.",
                        "점수가 높은 chunk를 topK만큼 선택합니다.",
                        "실제 RAG에서는 이 단계가 vector DB 검색과 reranking에 해당합니다."
                )
        );
    }

    public RagAnswerResponse ask(RagQuestionRequest request) {
        RagSearchResponse retrieval = search(new RagSearchRequest(request.question(), request.normalizedTopK()));
        List<RagCitation> citations = retrieval.hits().stream()
                .map(hit -> new RagCitation(hit.documentId(), hit.title(), hit.source(), hit.chunkIndex(), hit.chunk()))
                .toList();
        String answer = createAnswer(request.question(), retrieval.hits());

        return new RagAnswerResponse(
                request.question(),
                answer,
                citations,
                retrieval,
                List.of(
                        "사용자 질문을 검색 쿼리로 변환합니다.",
                        "관련 chunk를 검색해 컨텍스트 후보를 고릅니다.",
                        "선택된 chunk를 근거로 mock 답변을 조립합니다.",
                        "실제 서비스에서는 이 컨텍스트를 LLM 프롬프트에 넣고 답변과 citation을 생성합니다."
                )
        );
    }

    private void addSeed(String title, String source, String content) {
        documents.add(createDocument(title, source, content));
    }

    private StoredDocument createDocument(String title, String source, String content) {
        List<StoredChunk> chunks = chunk(content);
        List<String> allKeywords = chunks.stream()
                .flatMap(chunk -> chunk.keywords().stream())
                .distinct()
                .toList();
        return new StoredDocument(idGenerator.incrementAndGet(), title, source, content, chunks, allKeywords, Instant.now());
    }

    private RagDocumentResponse toResponse(StoredDocument document, List<String> steps) {
        return new RagDocumentResponse(
                document.id(),
                document.title(),
                document.source(),
                document.content(),
                document.chunks().stream().map(StoredChunk::text).toList(),
                document.keywords(),
                document.createdAt(),
                steps
        );
    }

    private RagSearchHit toHit(StoredDocument document, StoredChunk chunk, List<String> queryKeywords) {
        Set<String> matched = new LinkedHashSet<>(chunk.keywords());
        matched.retainAll(queryKeywords);

        double score = queryKeywords.isEmpty()
                ? 0
                : (double) matched.size() / Math.max(queryKeywords.size(), chunk.keywords().size());
        score = Math.round(score * 1000.0) / 1000.0;

        return new RagSearchHit(
                document.id(),
                document.title(),
                document.source(),
                chunk.index(),
                chunk.text(),
                score,
                new ArrayList<>(matched)
        );
    }

    private String createAnswer(String question, List<RagSearchHit> hits) {
        if (hits.isEmpty()) {
            return "관련 문서를 찾지 못했습니다. 문서를 먼저 등록하거나 질문에 문서 keyword를 더 넣어보세요.";
        }

        StringBuilder builder = new StringBuilder();
        builder.append("질문 `").append(question).append("`에 대해 검색된 근거를 보면, ");
        builder.append(hits.getFirst().chunk());

        if (hits.size() > 1) {
            builder.append(" 추가로 ");
            builder.append(hits.subList(1, hits.size()).stream()
                    .map(RagSearchHit::chunk)
                    .limit(2)
                    .reduce((left, right) -> left + " " + right)
                    .orElse(""));
        }

        builder.append(" 이 답변은 학습용 mock 생성 결과이며, 실제 RAG에서는 LLM이 검색 컨텍스트를 읽고 자연어 답변을 생성합니다.");
        return builder.toString();
    }

    private List<StoredChunk> chunk(String content) {
        String[] sentences = content.split("(?<=[.!?。！？])\\s+|(?<=다\\.)\\s*");
        List<StoredChunk> chunks = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        int chunkIndex = 1;

        for (String sentence : sentences) {
            if (sentence.isBlank()) {
                continue;
            }
            if (current.length() + sentence.length() > 180 && !current.isEmpty()) {
                String text = current.toString().trim();
                chunks.add(new StoredChunk(chunkIndex++, text, keywords(text)));
                current.setLength(0);
            }
            current.append(sentence.trim()).append(" ");
        }

        if (!current.isEmpty()) {
            String text = current.toString().trim();
            chunks.add(new StoredChunk(chunkIndex, text, keywords(text)));
        }

        return chunks;
    }

    private List<String> keywords(String value) {
        String normalized = value.toLowerCase(Locale.ROOT)
                .replaceAll("[^0-9a-z가-힣]+", " ");
        return List.of(normalized.split("\\s+")).stream()
                .map(String::trim)
                .filter(token -> token.length() >= 2)
                .filter(token -> !List.of("그리고", "하지만", "있는", "없는", "합니다", "입니다", "에서", "으로", "또는").contains(token))
                .distinct()
                .limit(20)
                .toList();
    }

    private record StoredDocument(
            int id,
            String title,
            String source,
            String content,
            List<StoredChunk> chunks,
            List<String> keywords,
            Instant createdAt
    ) {
    }

    private record StoredChunk(
            int index,
            String text,
            List<String> keywords
    ) {
    }
}
