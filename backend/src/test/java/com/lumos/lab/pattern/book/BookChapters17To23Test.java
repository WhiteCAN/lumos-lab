package com.lumos.lab.pattern.book;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class BookChapters17To23Test {
    private final BookChapters17To23 service = new BookChapters17To23();
    private BookPatternRequest request(String text, int count, int value, boolean fail) {
        return new BookPatternRequest(text, count, value, 7L, fail);
    }
    @Test void observersReceiveSameGeneratedValuesAndCanBeDetached() {
        var result = service.run("observer", request("incremental", 3, 5, false));
        assertThat(result.result().get("digits")).isEqualTo(java.util.List.of(5, 6, 7));
        assertThat(service.run("observer", request("incremental", 3, 5, true)).result().get("graphs"))
                .isEqualTo(java.util.List.of());
    }
    @Test void mementoRestoresSavedMoneyAfterForcedLoss() {
        var result = service.run("memento", request("", 1, 100, true));
        assertThat(result.result().get("money")).isEqualTo(result.result().get("savedMoney"));
        assertThat(result.steps()).anyMatch(s -> s.contains("restoreMemento"));
    }
    @Test void stateChangesAtNineAndSeventeen() {
        var result = service.run("state", request("8,9,16,17", 1, 0, false));
        assertThat(result.result().get("state")).isEqualTo("NightState");
        assertThat(result.steps()).anyMatch(s -> s.contains("금고사용(주간)"));
        assertThatIllegalArgumentException().isThrownBy(() -> service.run("state", request("24", 1, 0, false)));
    }
    @Test void flyweightSharesIdentityOnlyWhenEnabled() {
        assertThat(service.run("flyweight", request("1212", 1, 0, false)).result().get("instances")).isEqualTo(2);
        assertThat(service.run("flyweight", request("1212", 1, 0, true)).result().get("instances")).isEqualTo(4);
    }
    @Test void proxyConstructsOnlyOnFirstPrint() {
        assertThat(service.run("proxy", request("Alice", 3, 0, false)).result().get("constructions")).isEqualTo(1);
        assertThat(service.run("proxy", request("Alice", 3, 0, true)).result().get("constructions")).isEqualTo(0);
    }
    @Test void commandUndoRemovesMostRecentDrawBeforeReplay() {
        assertThat(service.run("command", request("", 3, 10, true)).result().get("points"))
                .isEqualTo(java.util.List.of(java.util.List.of(11, 11), java.util.List.of(10, 10)));
    }
    @Test void interpreterBuildsAndExecutesNestedSyntaxTree() {
        var result = service.run("interpreter", request("program repeat 2 go right end end", 1, 0, false));
        assertThat(result.result()).containsEntry("x", 1).containsEntry("y", -1).containsEntry("direction", "S").containsEntry("executed", 4);
    }
    @Test void interpreterRejectsMalformedOrExcessivePrograms() {
        for (String text : java.util.List.of("program go", "program jump end", "program end go", "program repeat -1 go end end", "program repeat 21 go end end", "program repeat 20 repeat 20 go end end end", "program " + "repeat 1 ".repeat(9) + "go " + "end ".repeat(10))) {
            assertThatIllegalArgumentException().as(text).isThrownBy(() -> service.run("interpreter", request(text, 1, 0, false)));
        }
    }
    @Test void seededRunsAreRequestLocalAndRepeatable() {
        for (String slug : java.util.List.of("observer", "memento")) {
            var input = request("random", 8, 100, false);
            assertThat(service.run(slug, input)).isEqualTo(service.run(slug, input));
        }
    }
}
