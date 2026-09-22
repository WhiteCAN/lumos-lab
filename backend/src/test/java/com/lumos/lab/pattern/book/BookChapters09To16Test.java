package com.lumos.lab.pattern.book;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class BookChapters09To16Test {
    private final BookChapters09To16 chapters = new BookChapters09To16();
    private BookPatternResult run(String slug, String text, int count, int value, boolean fail) {
        return chapters.run(slug, new BookPatternRequest(text, count, value, 42, fail));
    }
    @Test void bridgeDelegatesRepeatedPrintingToImplementation() {
        assertEquals(List.of("+--+", "|hi|", "|hi|", "+--+"), run("bridge", "hi", 2, 0, false).result().get("lines"));
    }
    @Test void strategiesAreSeededAndRoundAccountingIsConserved() {
        var first = run("strategy", "", 20, 0, false);
        assertEquals(first, run("strategy", "", 20, 0, false));
        assertEquals(20, (int) first.result().get("wins") + (int) first.result().get("losses") + (int) first.result().get("draws"));
    }
    @Test void compositeSumsLeavesIncludingZeroSizes() {
        assertEquals(21, run("composite", "docs", 3, 7, false).result().get("totalSize"));
        assertEquals(0, run("composite", "docs", 3, 0, false).result().get("totalSize"));
    }
    @Test void decoratorsAccumulateDimensions() {
        var result = run("decorator", "hi", 2, 0, false).result();
        assertEquals(List.of("+----+", "|#hi#|", "+----+"), result.get("lines"));
        assertEquals(6, result.get("columns"));
        assertEquals(3, result.get("rows"));
    }
    @Test void visitorDispatchesByElementAndSearchesSuffix() {
        assertEquals(List.of("/root/docs/file-1.txt", "/root/docs/file-3.txt"), run("visitor", ".txt", 3, 4, false).result().get("found"));
        assertEquals(List.of(), run("visitor", ".pdf", 3, 4, false).result().get("found"));
    }
    @Test void chainStopsAtFirstMatchOrReportsUnhandled() {
        assertEquals("Bob", run("chain-of-responsibility", "", 1, 10, false).result().get("handler"));
        assertEquals("Charlie", run("chain-of-responsibility", "", 1, 42, false).result().get("handler"));
        assertEquals("미해결", run("chain-of-responsibility", "", 1, 100, false).result().get("handler"));
    }
    @Test void facadeEscapesInputAndReturnsMissingMemberWithoutWritingFiles() {
        assertTrue(run("facade", "<b>", 1, 0, false).result().get("html").toString().contains("&lt;b&gt;"));
        assertEquals("회원 없음", run("facade", "hi", 1, 0, true).result().get("status"));
    }
    @Test void mediatorSupportsGuestEmptyUserAndExerciseRule() {
        assertEquals(true, run("mediator", "", 1, 0, false).result().get("okEnabled"));
        assertEquals(false, run("mediator", "", 1, 1, false).result().get("passEnabled"));
        assertEquals(true, run("mediator", "abc", 3, 1, false).result().get("okEnabled"));
        assertEquals(false, run("mediator", "abc", 3, 1, true).result().get("okEnabled"));
        assertEquals(true, run("mediator", "abcd", 4, 1, true).result().get("okEnabled"));
    }
}
