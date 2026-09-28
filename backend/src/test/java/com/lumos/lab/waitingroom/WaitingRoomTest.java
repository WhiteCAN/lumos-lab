package com.lumos.lab.waitingroom;

import com.lumos.lab.common.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.*;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class WaitingRoomTest {
    private final WaitingRoomService service = new WaitingRoomService();
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new WaitingRoomController(service))
            .setControllerAdvice(new GlobalExceptionHandler()).build();
    private WaitingRoomController.Operation op(String type, String id, int seconds) {
        return new WaitingRoomController.Operation(type, id, BigDecimal.valueOf(seconds));
    }
    private WaitingRoomService.Result run(WaitingRoomController.Operation... ops) {
        return service.run(new WaitingRoomController.Request(BigDecimal.ONE, BigDecimal.TEN, List.of(ops)));
    }
    @Test void duplicateJoinDoesNotMoveQueueOrExtendLeaseAndLeaveAdmitsFifo() {
        var result = run(op("JOIN","A",0), op("JOIN","B",0), op("JOIN","C",0),
                op("ADVANCE","",5), op("JOIN","A",0), op("JOIN","B",0));
        assertEquals(10, result.visitors().getFirst().expiresAt());
        assertEquals(1, result.visitors().get(1).position());
        assertEquals(2, result.visitors().get(2).position());
        var released = run(op("JOIN","A",0), op("JOIN","B",0), op("JOIN","C",0), op("LEAVE","A",0));
        assertEquals("ACTIVE", released.visitors().get(1).state());
        assertEquals(1, released.visitors().get(2).position());
    }
    @Test void expiryAtBoundaryPromotesWaitingAndRejectsOldAdmission() {
        var result = run(op("JOIN","A",0), op("JOIN","B",0), op("ADVANCE","",10), op("CHECK","A",0));
        assertEquals("EXPIRED", result.visitors().getFirst().state());
        assertEquals("ACTIVE", result.visitors().get(1).state());
        assertEquals(20, result.visitors().get(1).expiresAt());
        assertTrue(result.events().getLast().message().contains("입장 거절"));
        assertTrue(run(op("CHECK","unknown",0)).events().getLast().message().contains("입장 거절"));
    }
    @Test void cancellationAndReentryGoToTail() {
        var result = run(op("JOIN","A",0), op("JOIN","B",0), op("JOIN","C",0),
                op("LEAVE","B",0), op("JOIN","B",0), op("LEAVE","A",0));
        assertEquals("ACTIVE", result.visitors().get(2).state());
        assertEquals(1, result.visitors().get(1).position());
    }
    @Test void everyPrefixRespectsCapacityAndTotalLimitAndRequestsAreIsolated() {
        List<WaitingRoomController.Operation> operations = new ArrayList<>();
        for (int i=0; i<25; i++) {
            operations.add(op("JOIN", "V"+i, 0));
            var result = service.run(new WaitingRoomController.Request(BigDecimal.valueOf(3), BigDecimal.TEN, operations));
            assertEquals(Math.min(i+1, 3), result.visitors().stream().filter(v -> v.state().equals("ACTIVE")).count());
            assertTrue(result.visitors().size() <= 20);
        }
        assertTrue(run().visitors().isEmpty());
    }
    @Test void httpReturnsEnvelopeAndRejectsInvalidInputs() throws Exception {
        mvc.perform(post("/api/labs/waiting-room").contentType(MediaType.APPLICATION_JSON)
                .content("""
                {"capacity":1,"ttlSeconds":10,"operations":[{"type":"JOIN","visitor":"A","seconds":0}]}
                """))
                .andExpect(status().isOk()).andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.visitors[0].state").value("ACTIVE"));
        for (String body : List.of("{}", "{\"capacity\":0,\"ttlSeconds\":10,\"operations\":[]}",
                "{\"capacity\":1.5,\"ttlSeconds\":10,\"operations\":[]}",
                "{\"capacity\":1,\"ttlSeconds\":10.5,\"operations\":[]}",
                "{\"capacity\":1,\"ttlSeconds\":10,\"operations\":[{\"type\":\"ADVANCE\",\"visitor\":\"\",\"seconds\":1.5}]}",
                "{\"capacity\":1,\"ttlSeconds\":121,\"operations\":[]}",
                "{\"capacity\":1,\"ttlSeconds\":10,\"operations\":[null]}",
                "{\"capacity\":1,\"ttlSeconds\":10,\"operations\":[{\"type\":\"JOIN\",\"visitor\":\"\",\"seconds\":0}]}",
                "{\"capacity\":1,\"ttlSeconds\":10,\"operations\":[{\"type\":\"ADVANCE\",\"visitor\":\"\",\"seconds\":0}]}",
                "{\"capacity\":1,\"ttlSeconds\":10,\"operations\":[{\"type\":\"OTHER\",\"visitor\":\"A\",\"seconds\":0}]}")) {
            mvc.perform(post("/api/labs/waiting-room").contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.success").value(false));
        }
    }
}
