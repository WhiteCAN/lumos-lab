package com.lumos.lab.learning;

import org.junit.jupiter.api.Test;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import static org.assertj.core.api.Assertions.*;

class IndexLabServiceTest {
    @Test void actualH2PlansChangeAfterIndexWithoutChangingResult() throws Exception {
        var service = new IndexLabService(new DriverManagerDataSource("jdbc:h2:mem:indexlab;DB_CLOSE_DELAY=-1", "sa", ""));
        var result = service.run(30, 7);
        assertThat(result.get("beforePlan").toString().toLowerCase()).contains("tablescan");
        assertThat(result.get("afterPlan").toString().toLowerCase()).contains("lab_idx_");
        assertThat(result.get("matches")).isEqualTo(1);
    }
}
