package com.lumos.lab.pattern.book;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class BookChapters01To08Test {
    private final BookChapters01To08 labs = new BookChapters01To08();
    private BookPatternResult run(String slug, String text, int count, boolean fail) {
        return labs.run(slug, new BookPatternRequest(text, count, 50, 1, fail));
    }
    @Test void iteratorTraversesAndReportsExhaustion() {
        var result = run("iterator", "자바", 3, true);
        assertThat(result.result().get("books")).isEqualTo(java.util.List.of("자바 1", "자바 2", "자바 3"));
        assertThat(result.result().get("exhaustedException")).isEqualTo("NoSuchElementException");
        assertThat(run("iterator", "다른 책", 1, false).result().get("books")).isEqualTo(java.util.List.of("다른 책 1"));
    }
    @Test void adapterDelegatesBothOperations() {
        assertThat(run("adapter", "안녕", 2, false).result()).containsEntry("weak", "(안녕)").containsEntry("strong", "*안녕*");
    }
    @Test void templatePreservesAlgorithmAndVariableRepeatCount() {
        assertThat(run("template-method", "Hi", 2, false).result().get("lines")).isEqualTo(java.util.List.of("+--+", "|Hi|", "|Hi|", "+--+"));
        assertThat((java.util.List<?>) run("template-method", "", 1, false).result().get("lines")).hasSize(3);
    }
    @Test void factoryRegistersBeforeUseAndResetsPerRequest() {
        assertThat(run("factory-method", "홍길동", 2, false).result()).containsEntry("serials", java.util.List.of(100, 101)).containsEntry("registered", 2);
        assertThat(run("factory-method", "김", 1, false).result().get("serials")).isEqualTo(java.util.List.of(100));
    }
    @Test void singletonIdentityIsStableWithoutMutableGlobalCounters() {
        assertThat(run("singleton", "", 20, false).result()).containsEntry("sameInstance", true).containsEntry("lookups", 20);
    }
    @Test void prototypeCreatesIndependentCopies() {
        assertThat(run("prototype", "Hi", 3, false).result()).containsEntry("distinctCopies", 3).containsEntry("prototypeUses", 0);
        assertThat(run("prototype", "Hi", 1, true).result().get("error")).isEqualTo("등록되지 않은 원형: missing");
    }
    @Test void builderProducesBothFormatsAndEscapesHtml() {
        var result = run("builder", "<제목>", 2, false).result();
        assertThat((String) result.get("html")).contains("&lt;제목&gt;", "<li>항목 2</li>").doesNotContain("<제목>");
        assertThat((String) result.get("text")).contains("<제목>", "항목 2");
    }
    @Test void abstractFactoryCreatesMatchingFamilies() {
        var result = run("abstract-factory", "<링크>", 2, false).result();
        assertThat((String) result.get("listHtml")).contains("<ul>", "&lt;링크&gt; 2");
        assertThat((String) result.get("divHtml")).contains("<section>", "<div>").doesNotContain("<ul>");
    }
}
