import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { test } from "node:test";
import { studyCategories, studyPages, getStudyPage } from "../src/lib/study-pages.ts";

test("학습 라우트가 모두 한 번씩 등록되어 메뉴와 검색에서 빠지지 않는다", async () => {
  const files = await readdir(new URL("../src/app/", import.meta.url), { recursive: true });
  const routes = files.filter((file) => /(^|[\\/])page\.tsx$/.test(file))
    .map((file) => `/${file.replaceAll("\\", "/").replace(/(^|\/)page\.tsx$/, "")}`)
    .filter((route) => route !== "/dashboard").sort();
  assert.deepEqual(studyPages.map((page) => page.href).sort(), routes);
  assert.equal(new Set(studyPages.map((page) => page.href)).size, studyPages.length);
  for (const page of studyPages) {
    assert.ok(studyCategories.includes(page.category), page.href);
    assert.ok(page.description.trim(), page.href);
  }
});

test("개요와 상세 페이지는 정확한 URL로 조회하며 미등록 URL은 드러낸다", () => {
  assert.equal(getStudyPage("/patterns").title, "디자인 패턴 개요");
  assert.equal(getStudyPage("/patterns/strategy").title, "전략 · Strategy");
  assert.throws(() => getStudyPage("/unknown"), /등록되지 않은/);
});

test("모의 RAG 실습은 검색 결과에서도 상태를 식별할 수 있다", () => {
  for (const href of ["/rag/documents", "/rag/vector-search", "/rag/ask"]) {
    assert.equal(getStudyPage(href).simulated, true);
  }
});
