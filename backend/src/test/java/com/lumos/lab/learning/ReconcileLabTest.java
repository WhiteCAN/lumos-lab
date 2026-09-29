package com.lumos.lab.learning;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ReconcileLabTest {
    @Test void insufficientCapacityAndReadinessAreDifferent() {
        var result = new ReconcileLabController().run(new ReconcileLabController.Request(5, 2, 3, true, false)).data();
        assertEquals(3, result.create()); assertEquals(2, result.pending());
        assertEquals(3, result.running()); assertEquals(0, result.ready());
    }
    @Test void scaleDownAndImageFailure() {
        var result = new ReconcileLabController().run(new ReconcileLabController.Request(2, 5, 5, false, true)).data();
        assertEquals(3, result.delete()); assertEquals(0, result.running()); assertEquals(0, result.ready());
    }
}
