package com.lumos.lab.learning;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.*;

class DebugLabServiceTest {
    private final DebugLabService service = new DebugLabService();

    @Test void orderedMapsShowRealInsertionSortedAndAccessOrder() {
        var result = service.orderedMaps(List.of(30, 10, 20, 10), 30, 25);
        assertThat(result.sortedKeys()).containsExactly(10, 20, 30);
        assertThat(result.insertionKeys()).containsExactly(30, 10, 20);
        // accessOrder 모드에서는 중복 키 put(10)도 해당 키를 뒤로 이동시킵니다.
        assertThat(result.accessKeys()).containsExactly(20, 10, 30);
        assertThat(result.floor()).isEqualTo(20);
        assertThat(result.ceiling()).isEqualTo(30);
        assertThat(result.steps()).hasSize(5);
    }

    @Test void mapBoundariesAndAbsentAccessDoNotInventEntries() {
        var result = service.orderedMaps(List.of(10), 999, 0);
        assertThat(result.floor()).isNull();
        assertThat(result.ceiling()).isEqualTo(10);
        assertThat(result.accessKeys()).containsExactly(10);
    }

    @Test void retryActuallyCallsDependencyUntilSuccessOrLimit() {
        var succeeded = service.retry(2, 3);
        assertThat(succeeded.attempts()).isEqualTo(3);
        assertThat(succeeded.success()).isTrue();
        var failed = service.retry(3, 2);
        assertThat(failed.attempts()).isEqualTo(2);
        assertThat(failed.success()).isFalse();
    }

    @Test void invalidBoundsAreRejected() {
        assertThatIllegalArgumentException().isThrownBy(() -> service.retry(-1, 3));
        assertThatIllegalArgumentException().isThrownBy(() -> service.retry(1, 20));
        assertThatIllegalArgumentException().isThrownBy(() -> service.orderedMaps(List.of(), 0, 0));
    }
}
