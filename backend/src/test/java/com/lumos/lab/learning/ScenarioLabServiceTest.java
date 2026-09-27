package com.lumos.lab.learning;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.*;

class ScenarioLabServiceTest {
    private final ScenarioLabService service = new ScenarioLabService();
    private ScenarioLabService.Input input(List<Integer> values, int parameter, boolean fail) {
        return new ScenarioLabService.Input(values, parameter, fail);
    }
    @Test void twoSumUsesDistinctIndicesAndReportsMissingPair() {
        assertThat(service.run("two-sum", input(List.of(3,3),6,false)).result().toString()).contains("0", "1");
        assertThat(service.run("two-sum", input(List.of(3),6,false)).result()).isEqualTo(List.of());
    }
    @Test void lruEvictsLeastRecentlyUsedAndCountsDatabaseLoads() {
        var result = service.run("cache", input(List.of(1,2,1,3,2),2,false));
        assertThat(result.steps()).anyMatch(s -> s.contains("HIT 1"));
        assertThat(result.steps()).anyMatch(s -> s.contains("EVICT 2"));
    }
    @Test void shardRoutingSupportsNegativeKeys() {
        var result = service.run("sharding", input(List.of(-1,4),3,false));
        assertThat(result.steps()).contains("key=-1 → shard=2", "key=4 → shard=1");
    }
    @Test void failedOutboxTransactionDoesNotPublish() {
        var result = service.run("outbox", input(List.of(1,2),1,true));
        assertThat(result.result().toString()).contains("published=[]", "orders=[]");
    }
    @Test void circuitStopsCallingDependencyAtThreshold() {
        var result = service.run("circuit", input(List.of(0,0,1),2,false));
        assertThat(result.steps()).contains("OPEN: 호출 차단");
    }
    @Test void pipelineStopsAfterFailedCheck() {
        var result = service.run("pipeline", input(List.of(1,2),1,true));
        assertThat(result.steps()).doesNotContain("배포 단계 실행");
    }
    @Test void scenariosUseRequestLocalState() {
        var first=service.run("broker",input(List.of(1,4,1),3,false));
        assertThat(service.run("broker",input(List.of(1,4,1),3,false))).isEqualTo(first);
    }
    @Test void unknownScenarioAndInvalidCapacityAreRejected() {
        assertThatIllegalArgumentException().isThrownBy(() -> service.run("unknown",input(List.of(1),1,false)));
        assertThatIllegalArgumentException().isThrownBy(() -> service.run("cache",input(List.of(1),0,false)));
    }
}
