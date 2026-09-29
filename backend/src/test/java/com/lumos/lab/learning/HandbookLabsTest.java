package com.lumos.lab.learning;

import jakarta.validation.Validation;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

class HandbookLabsTest {
    @Test void independentGroupsReceiveAllPartitionsAndExtraMembersAreIdle() {
        var result = new ConsumerGroupLabController().run(new ConsumerGroupLabController.Request(2, List.of("a","a","a","b"))).data();
        assertEquals(Map.of("consumer-0",List.of(0),"consumer-1",List.of(1),"consumer-2",List.of(),"consumer-3",List.of(0,1)), result.get("assignments"));
        assertEquals(List.of("consumer-2"), result.get("idleConsumers"));
    }
    @Test void leastConnectionsAccountsForExistingLoadUnlikeRoundRobin() {
        var controller = new LoadBalanceLabController();
        assertEquals(List.of(1,1,1,2,1,2),controller.run(new LoadBalanceLabController.Request("least-connections",List.of(8,0,2),6)).data().get("assignments"));
        assertEquals(List.of(0,1,2,0,1,2),controller.run(new LoadBalanceLabController.Request("round-robin",List.of(8,0,2),6)).data().get("assignments"));
    }
    @SuppressWarnings("unchecked")
    @Test void probabilitiesSumToOneAndTemperatureChangesConcentration() {
        var controller = new TokenProbabilityLabController();
        var warm = (List<Double>)controller.run(new TokenProbabilityLabController.Request(List.of(2d,1d,0d),1d)).data().get("probabilities");
        var cold = (List<Double>)controller.run(new TokenProbabilityLabController.Request(List.of(2d,1d,0d),.1d)).data().get("probabilities");
        var shifted = controller.run(new TokenProbabilityLabController.Request(List.of(12d,11d,10d),1d)).data().get("probabilities");
        assertEquals(1d,warm.stream().mapToDouble(Double::doubleValue).sum(),1e-12);
        assertEquals(warm,shifted);
        assertTrue(cold.getFirst()>warm.getFirst());
    }
    @Test void tailLatencyIsNotCapturedByMeanAndThresholdIsStrict() {
        var samples = new ArrayList<>(Collections.nCopies(19,200)); samples.add(5000);
        var result = new LatencyLabController().run(new LatencyLabController.Request(samples,200)).data();
        assertEquals(440d,result.get("meanMs")); assertEquals(200,result.get("p95Ms"));
        assertEquals(5000,result.get("p99Ms")); assertEquals(1L,result.get("overThreshold"));
    }
    @Test void boundsAndNestedInputsAreValidated() {
        try(var factory = Validation.buildDefaultValidatorFactory()) {
            var validator = factory.getValidator();
            assertFalse(validator.validate(new LatencyLabController.Request(List.of(),1000)).isEmpty());
            assertFalse(validator.validate(new TokenProbabilityLabController.Request(List.of(21d),0d)).isEmpty());
            assertFalse(validator.validate(new ConsumerGroupLabController.Request(0,List.of(""))).isEmpty());
            assertFalse(validator.validate(new LoadBalanceLabController.Request("unknown",List.of(-1),31)).isEmpty());
        }
    }
}
