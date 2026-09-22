package com.lumos.lab.learning;

import org.springframework.stereotype.Service;
import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Service
public class IndexLabService {
    private final DataSource dataSource;
    public IndexLabService(DataSource dataSource) { this.dataSource = dataSource; }

    public Map<String, Object> run(int count, int key) throws SQLException {
        if (count < 1 || count > 1000) throw new IllegalArgumentException("rowCount는 1~1000입니다.");
        // 외부 입력은 SQL 식별자에 사용하지 않습니다. 임시 테이블은 이 연결 안에서만 사용합니다.
        String suffix = UUID.randomUUID().toString().replace("-", "");
        String table = "lab_rows_" + suffix;
        try (var connection = dataSource.getConnection(); var statement = connection.createStatement()) {
            if (!connection.getMetaData().getDatabaseProductName().equals("H2"))
                throw new IllegalArgumentException("이 실습은 기본 H2 프로필에서 실행하세요.");
            statement.execute("create local temporary table " + table + " (item_key integer, payload varchar(40))");
            try {
                try (var insert = connection.prepareStatement("insert into " + table + " values (?, ?)")) {
                    for (int i=0;i<count;i++) { insert.setInt(1,i); insert.setString(2,"item-"+i); insert.addBatch(); }
                    insert.executeBatch();
                }
                String before = plan(connection, table, key);
                statement.execute("create index lab_idx_" + suffix + " on " + table + " (item_key)");
                String after = plan(connection, table, key);
                try (var query = connection.prepareStatement("select count(*) from " + table + " where item_key=?")) {
                    query.setInt(1,key);
                    try (var rows=query.executeQuery()) { rows.next(); return Map.of("beforePlan",before,"afterPlan",after,"matches",rows.getInt(1)); }
                }
            } finally { statement.execute("drop table if exists " + table); }
        }
    }

    private String plan(Connection connection, String table, int key) throws SQLException {
        try (var query=connection.prepareStatement("explain select * from " + table + " where item_key=?")) {
            query.setInt(1,key);
            try(var rows=query.executeQuery()) { rows.next(); return rows.getString(1); }
        }
    }
}
