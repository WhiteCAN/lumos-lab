package com.lumos.lab.stackheap;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class StackHeapServiceTest {
    private final StackHeapService service = new StackHeapService();

    @Test void mutationIsVisibleToCaller() {
        var result = service.run(20, 30, false);
        assertThat(result.callerAgeAfter()).isEqualTo(30);
        assertThat(result.sameReferenceBeforeReturn()).isTrue();
    }

    @Test void reassignmentDoesNotChangeCallersReference() {
        var result = service.run(20, 30, true);
        assertThat(result.callerAgeAfter()).isEqualTo(20);
        assertThat(result.calleeAgeBeforeReturn()).isEqualTo(30);
        assertThat(result.sameReferenceBeforeReturn()).isFalse();
        assertThat(result.steps()).hasSize(4);
    }

    @Test void independentRequestsAndBoundaryInputs() {
        service.run(20, 99, false);
        assertThat(service.run(0, 150, true).callerAgeAfter()).isZero();
        assertThatThrownBy(() -> service.run(-1, 30, false)).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> service.run(20, 151, true)).isInstanceOf(IllegalArgumentException.class);
    }
}
