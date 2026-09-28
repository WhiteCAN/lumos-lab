package com.lumos.lab.waitingroom;

import org.springframework.stereotype.Service;
import java.util.*;

/** 요청별 이력을 재실행하는 모형. 공유 상태·실제 인증·분산 락을 구현하지 않는다. */
@Service
public class WaitingRoomService {
    static final class Ticket {
        final String visitor;
        String state = "WAITING";
        Integer expiresAt;
        Ticket(String visitor) { this.visitor = visitor; }
    }
    public record Visitor(String visitor, String state, int position, Integer expiresAt) {}
    public record Event(int time, String message) {}
    public record Result(int now, int capacity, List<Visitor> visitors, List<Event> events, String scope) {}

    public Result run(WaitingRoomController.Request request) {
        // 객체를 요청 내부에 생성하므로 다른 사용자의 실습과 섞이지 않는다.
        Map<String, Ticket> tickets = new LinkedHashMap<>();
        Deque<Ticket> waiting = new ArrayDeque<>();
        List<Event> events = new ArrayList<>();
        int now = 0;
        for (var operation : request.operations()) {
            String id = operation.visitor();
            int seconds = operation.seconds().intValueExact();
            if (!operation.type().equals("ADVANCE") && id.isBlank()) {
                throw new IllegalArgumentException("방문자 ID가 필요합니다.");
            }
            if (operation.type().equals("ADVANCE")) {
                if (seconds < 1 || !id.isEmpty()) {
                    throw new IllegalArgumentException("ADVANCE는 빈 visitor와 1~120초가 필요합니다.");
                }
                now += seconds;
                expire(tickets, now, events);
                events.add(new Event(now, "가상 시계 진행: 지금 한 번 만료 정리와 입장을 처리합니다."));
            } else {
                if (seconds != 0) throw new IllegalArgumentException("방문자 동작의 seconds는 0이어야 합니다.");
                Ticket ticket = tickets.get(id);
                switch (operation.type()) {
                    case "JOIN" -> {
                        if (ticket != null && (ticket.state.equals("WAITING") || ticket.state.equals("ACTIVE"))) {
                            events.add(new Event(now, id + ": 중복 진입, 기존 순번·만료 유지"));
                        } else if (waiting.size() + activeCount(tickets) >= 20) {
                            events.add(new Event(now, id + ": 거절 — 실습 정원(대기+입장) 20명"));
                        } else {
                            ticket = new Ticket(id);
                            tickets.put(id, ticket);
                            waiting.addLast(ticket);
                            events.add(new Event(now, id + ": 대기열 끝에 등록"));
                        }
                    }
                    case "CHECK" -> events.add(new Event(now, id + ": 보호 API 모형 → "
                            + (ticket != null && ticket.state.equals("ACTIVE") ? "입장 허용" : "입장 거절")));
                    case "LEAVE" -> {
                        if (ticket != null && (ticket.state.equals("ACTIVE") || ticket.state.equals("WAITING"))) {
                            waiting.remove(ticket);
                            ticket.state = "LEFT";
                            ticket.expiresAt = null;
                            events.add(new Event(now, id + ": 퇴장 / 대기 취소"));
                        } else events.add(new Event(now, id + ": 취소할 유효한 티켓 없음"));
                    }
                    default -> throw new IllegalArgumentException("지원하지 않는 동작입니다.");
                }
            }
            admit(tickets, waiting, request.capacity().intValueExact(), request.ttlSeconds().intValueExact(), now, events);
        }
        List<Ticket> queue = new ArrayList<>(waiting);
        List<Visitor> visitors = tickets.values().stream().map(ticket -> new Visitor(ticket.visitor,
                ticket.state, ticket.state.equals("WAITING") ? queue.indexOf(ticket) + 1 : 0, ticket.expiresAt)).toList();
        return new Result(now, request.capacity().intValueExact(), visitors, List.copyOf(events),
                "요청별 Java 메모리 모형: 이력 재실행·가상 시계. Redis·실제 인증·분산 동시성·실제 접근 차단은 실행하지 않습니다.");
    }

    private long activeCount(Map<String, Ticket> tickets) {
        return tickets.values().stream().filter(ticket -> ticket.state.equals("ACTIVE")).count();
    }

    private void expire(Map<String, Ticket> tickets, int now, List<Event> events) {
        for (Ticket ticket : tickets.values()) {
            if (ticket.state.equals("ACTIVE") && ticket.expiresAt <= now) {
                ticket.state = "EXPIRED";
                events.add(new Event(now, ticket.visitor + ": 입장 유효기간 만료"));
            }
        }
    }

    private void admit(Map<String, Ticket> tickets, Deque<Ticket> waiting,
                       int capacity, int ttl, int now, List<Event> events) {
        long active = activeCount(tickets);
        while (active < capacity && !waiting.isEmpty()) {
            Ticket ticket = waiting.removeFirst();
            ticket.state = "ACTIVE";
            ticket.expiresAt = now + ttl;
            active++;
            events.add(new Event(now, ticket.visitor + ": 입장 승인 → " + ticket.expiresAt + "초에 만료"));
        }
    }
}
