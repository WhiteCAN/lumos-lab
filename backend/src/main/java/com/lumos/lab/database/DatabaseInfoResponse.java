package com.lumos.lab.database;

import java.util.List;

public record DatabaseInfoResponse(
        String databaseProductName,
        String databaseProductVersion,
        String driverName,
        String url,
        String username,
        List<String> activeProfiles
) {
}
