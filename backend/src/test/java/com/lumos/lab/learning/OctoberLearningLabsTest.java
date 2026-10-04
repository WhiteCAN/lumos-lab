package com.lumos.lab.learning;

import jakarta.validation.Validation;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class OctoberLearningLabsTest {
    @Test void jsonIntegerContractRejectsSilentTruncationAndStrings() {
        var mapper = new tools.jackson.databind.json.JsonMapper();
        assertEquals(List.of(10,2), mapper.readValue("{\"values\":[10,2]}", ArrayPipelineLabController.Request.class).values());
        for (String input : List.of("{\"values\":[1.5]}", "{\"values\":[\"2\"]}", "{\"values\":[2147483648]}")) {
            assertThrows(tools.jackson.core.JacksonException.class, () -> mapper.readValue(input, ArrayPipelineLabController.Request.class));
        }
    }
    @Test void allWaitsForEntireIsrNotOnlyMinimum() {
        var c = new KafkaAckLabController();
        assertEquals("WAITING", c.run(new KafkaAckLabController.Request("all",3,3,2,2,false)).data().producerResult());
        assertEquals("ACKNOWLEDGED", c.run(new KafkaAckLabController.Request("all",3,3,2,3,false)).data().producerResult());
        var rejected = c.run(new KafkaAckLabController.Request("all",3,1,2,1,false)).data();
        assertEquals("NOT_ENOUGH_REPLICAS", rejected.producerResult());
        assertEquals(0, rejected.acceptedCopies());
    }
    @Test void leaderAcknowledgementDoesNotGuaranteeSurvivingCopy() {
        var c = new KafkaAckLabController();
        var result = c.run(new KafkaAckLabController.Request("1",3,3,2,1,true)).data();
        assertEquals("ACKNOWLEDGED", result.producerResult()); assertEquals(0, result.survivingCopies());
        assertEquals("NO_ACK", c.run(new KafkaAckLabController.Request("0",3,1,2,0,true)).data().producerResult());
        assertThrows(IllegalArgumentException.class, () -> c.run(new KafkaAckLabController.Request("all",2,3,2,1,false)));
        assertThrows(IllegalArgumentException.class, () -> c.run(new KafkaAckLabController.Request("all",3,2,2,3,false)));
    }
    @Test void enumSetUsesDeclarationOrderWhileMapRetainsCounts() {
        var c = new EnumLabController();
        var result = c.run(new EnumLabController.Request("SATURDAY",List.of("FRIDAY","MONDAY","FRIDAY"))).data();
        assertTrue(result.weekend()); assertEquals(5,result.ordinal()); assertEquals("SAT",result.code());
        assertEquals(List.of(EnumLabController.Day.MONDAY,EnumLabController.Day.FRIDAY),result.orderedDistinct());
        assertEquals(2,result.counts().get(EnumLabController.Day.FRIDAY));
        assertThrows(IllegalArgumentException.class, () -> c.run(new EnumLabController.Request("monday",List.of("FRIDAY"))));
    }
    @Test void arraysPreserveNegativeZeroAndDuplicateValues() {
        var result = new ArrayPipelineLabController().run(new ArrayPipelineLabController.Request(List.of(3,-2,0,3))).data();
        assertEquals(List.of(-2,0,3,3),result.numericSorted()); assertEquals(List.of(-2,0),result.evens());
        assertEquals(List.of(6,-4,0,6),result.doubled()); assertEquals(4,result.sum());
    }
    private AgentLabController.LoopResult loop(String pattern, int attempts, boolean allowed, boolean fail) {
        return new AgentLabController().loop(new AgentLabController.LoopRequest(pattern,List.of(2,3),4,attempts,allowed,fail)).data();
    }
    @Test void sameWrongDraftHasDifferentTerminationByPattern() {
        assertEquals("UNVERIFIED",loop("single-shot",2,true,false).status());
        assertEquals("REJECTED",loop("verifier-gated",2,true,false).status());
        var corrected = loop("reflexive",2,true,false);
        assertEquals("PASSED",corrected.status()); assertEquals(5,corrected.candidate()); assertEquals(2,corrected.attempts());
        assertEquals("LIMIT_REACHED",loop("reflexive",1,true,false).status());
        assertEquals("TOOL_DENIED",loop("reflexive",2,false,true).status());
        assertEquals("TOOL_ERROR",loop("reflexive",2,true,true).status());
        assertEquals(1,new AgentLabController().loop(new AgentLabController.LoopRequest("reflexive",List.of(2,3),5,2,false,true)).data().attempts());
    }
    @Test void permissionPrecedesApprovalAndNoWriteEverOccurs() {
        var c = new AgentLabController();
        assertEquals("DENIED",c.context(new AgentLabController.ContextRequest("cache","write-report",false,true,false)).data().toolStatus());
        assertEquals("APPROVAL_REQUIRED",c.context(new AgentLabController.ContextRequest("cache","write-report",true,false,false)).data().toolStatus());
        var preview=c.context(new AgentLabController.ContextRequest("CACHE queue","write-report",true,true,false)).data();
        assertEquals("PREVIEW_ONLY",preview.toolStatus()); assertEquals(2,preview.sources().size());
        assertTrue(c.context(new AgentLabController.ContextRequest("cached","none",true,true,false)).data().sources().isEmpty());
        assertEquals("TOOL_ERROR",c.context(new AgentLabController.ContextRequest("rag","read-metrics",true,false,true)).data().toolStatus());
    }
    @Test void inputLimitsIncludeNestedValuesAndNulls() {
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            var v=factory.getValidator();
            assertFalse(v.validate(new ArrayPipelineLabController.Request(List.of())).isEmpty());
            assertFalse(v.validate(new ArrayPipelineLabController.Request(List.of(10001))).isEmpty());
            assertFalse(v.validate(new EnumLabController.Request("MONDAY",List.of(""))).isEmpty());
            assertFalse(v.validate(new AgentLabController.LoopRequest("unknown",List.of(101),0,0,true,false)).isEmpty());
            assertFalse(v.validate(new AgentLabController.ContextRequest(" ","delete",false,false,false)).isEmpty());
            assertFalse(v.validate(new KafkaAckLabController.Request(null,0,1,1,0,false)).isEmpty());
        }
    }
}
