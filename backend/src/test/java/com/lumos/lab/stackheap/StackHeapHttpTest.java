package com.lumos.lab.stackheap;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class StackHeapHttpTest {
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(
            new StackHeapController(new StackHeapService())).build();

    @Test void returnsActualReferenceComparison() throws Exception {
        mvc.perform(post("/api/labs/stack-heap").contentType(MediaType.APPLICATION_JSON)
                .content("{\"initialAge\":20,\"nextAge\":30,\"reassign\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.callerAgeAfter").value(20))
                .andExpect(jsonPath("$.data.sameReferenceBeforeReturn").value(false));
    }

    @Test void rejectsOutOfRangeMissingAndNullAges() throws Exception {
        for (String body : new String[]{"{\"initialAge\":20,\"nextAge\":151}",
                "{\"initialAge\":-1,\"nextAge\":30}", "{}", "{\"initialAge\":null,\"nextAge\":30}"}) {
            mvc.perform(post("/api/labs/stack-heap").contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isBadRequest());
        }
    }
}
