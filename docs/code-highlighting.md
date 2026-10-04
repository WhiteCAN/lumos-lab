# 코드 문법 강조

학습 코드에는 highlight.js의 공식 GitHub Light / GitHub Dark 테마를 적용합니다. 사이트의 `.dark` 클래스에 따라 CSS로 전환하며 별도 테마 상태나 클라이언트 재강조 처리는 없습니다.

## 구성

- `frontend/src/components/syntax-code.tsx`: 키보드로 접근할 수 있는 코드 블록과 영역 내부 스크롤. 기본 글자 크기는 13px입니다.
- `frontend/src/lib/syntax-highlight.ts`: core와 필요한 12개 문법만 등록. 원문을 highlight.js로 이스케이프한 결과만 렌더링하며 임의 코드를 실행하지 않습니다.
- `frontend/src/components/syntax-code.css`: 패키지의 `styles/github.css`, `styles/github-dark.css`를 코드 영역에 한정해 적용한 복사본. 원본 색상·저작자 주석과 [BSD 라이선스](third-party/highlightjs-LICENSE.txt)를 보존합니다.

공통 CodeBlock, SOLID, 디자인 패턴 원본, Java 실습 반환 코드, React·프론트 기초 예제, 컬렉션 단계 코드, 공통 API JSON 결과에 적용합니다. 폴더 트리와 입력 textarea는 문법 강조 대상이 아닙니다.

```tsx
<CodeBlock title="Java 예제" code={source} language="java" />
<SyntaxCode code={source} language="python" label="Python 예제" />
```

언어가 알려져 있으면 language를 지정합니다. 생략한 기존 예제는 등록된 문법 안에서 자동 판별하므로 짧은 의사코드는 분류가 부정확할 수 있습니다. plaintext는 문법 색상 없이 원문만 표시합니다. 지원 언어는 Java, JavaScript, TypeScript, Python, JSON, SQL, Bash, YAML, XML/HTML, CSS, Dockerfile, HTTP입니다.

## 검증

`node --experimental-strip-types --test tests/syntax-highlight.test.mjs`, `npm run lint`, `npm run build`를 실행합니다. Java 토큰 분리와 HTML 예제의 이스케이프, 밝은/어두운 테마 전환, 모바일 코드 내부 스크롤을 확인합니다. 원문의 줄바꿈과 들여쓰기를 유지합니다.

공식 근거: [테마 미리보기](https://highlightjs.org/examples), [highlight.js API](https://highlightjs.readthedocs.io/en/latest/api.html).
