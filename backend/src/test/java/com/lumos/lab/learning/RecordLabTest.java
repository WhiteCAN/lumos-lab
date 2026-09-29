package com.lumos.lab.learning;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class RecordLabTest {
    @Test void mutableComponentChangesRecordEquality() {
        var result = new RecordLabController().run(new RecordLabController.Request("Dev", List.of("Java"), "Spring", false)).data();
        assertTrue(result.equalBefore()); assertFalse(result.equalAfter()); assertFalse(result.sameReference());
        assertEquals(List.of("Java", "Spring"), result.after());
    }
    @Test void defensiveCopyKeepsValueAndNormalizesName() {
        var result = new RecordLabController().run(new RecordLabController.Request(" Dev ", List.of("Java"), "Spring", true)).data();
        assertTrue(result.equalAfter()); assertEquals(List.of("Java"), result.after()); assertEquals("Dev", result.accessor());
    }
}
