import assert from "node:assert/strict";
import { test } from "node:test";
import { studyPages } from "../src/lib/study-pages.ts";
import { searchStudyPages } from "../src/lib/study-search.ts";

for (const [query, href] of [
  ["의존성 주입", "/spring-bean-di"],
  ["분산락", "/backend/redis-cache"],
  ["분산 락", "/backend/redis-cache"],
  ["Scanner", "/java/io-string"],
  ["Java Collection Framework", "/java/collections"],
  ["  ＫＡＦＫＡ  설정  ", "/messaging/kafka-config"],
  ["모의 벡터", "/rag/vector-search"],
]) {
  test(`이전 제목과 관련 키워드로 페이지를 찾는다: ${query}`, () => {
    assert.equal(searchStudyPages(query, studyPages)[0]?.href, href);
  });
}

test("빈 입력과 일치하지 않는 검색은 결과가 없다", () => {
  for (const query of ["", "   ", "없는검색어xyz", "Kafka Scanner"]) {
    assert.deepEqual(searchStudyPages(query, studyPages), []);
  }
});

test("제목 완전 일치, 부분 일치, 별칭·키워드, 설명 순으로 정렬하고 중복은 제외한다", () => {
  const base = { category: "분류", description: "", keywords: [], aliases: [] };
  const pages = [
    { ...base, href: "/description", title: "설명 검색", description: "트랜잭션 흐름" },
    { ...base, href: "/alias", title: "이전 이름", aliases: ["트랜잭션"] },
    { ...base, href: "/keyword", title: "관련 용어", keywords: ["트랜잭션"] },
    { ...base, href: "/partial", title: "트랜잭션: 커밋·롤백" },
    { ...base, href: "/exact", title: "트랜잭션" },
  ];
  assert.deepEqual(searchStudyPages("트랜잭션", [...pages, pages[4]]).map((page) => page.href),
    ["/exact", "/partial", "/alias", "/keyword", "/description"]);
});

test("한국어 조합형과 완성형은 같은 검색 결과를 만든다", () => {
  assert.equal(searchStudyPages("의존성 주입".normalize("NFD"), studyPages)[0]?.href, "/spring-bean-di");
});
