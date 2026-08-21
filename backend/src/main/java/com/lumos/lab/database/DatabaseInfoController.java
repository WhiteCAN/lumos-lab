package com.lumos.lab.database;

import com.lumos.lab.common.ApiResponse;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.util.Arrays;
import javax.sql.DataSource;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/database")
public class DatabaseInfoController {

    private final DataSource dataSource;
    private final Environment environment;

    public DatabaseInfoController(DataSource dataSource, Environment environment) {
        this.dataSource = dataSource;
        this.environment = environment;
    }

    @GetMapping("/info")
    public ApiResponse<DatabaseInfoResponse> info() throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            return ApiResponse.ok(new DatabaseInfoResponse(
                    metaData.getDatabaseProductName(),
                    metaData.getDatabaseProductVersion(),
                    metaData.getDriverName(),
                    maskUrl(metaData.getURL()),
                    metaData.getUserName(),
                    Arrays.asList(environment.getActiveProfiles())
            ));
        }
    }

    private String maskUrl(String url) {
        if (url == null) {
            return null;
        }
        return url.replaceAll("(?i)(password=)[^&;]+", "$1****");
    }
}
