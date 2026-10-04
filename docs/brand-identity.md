# Lumos 브랜드 아이콘

LumosGraphy의 CI는 **L 모노그램 + 렌즈 + 빛점**입니다. 사진을 담는 프레임과 빛을 단순한 기하 형태로 표현하여 작은 사이드바와 브라우저 탭에서도 읽히도록 설계했습니다.

| 서비스 | 렌즈·빛점 색상 | 공통 배경 / 모노그램 |
| --- | --- | --- |
| Lumos Photo | 앰버 `#F2C572` | 딥 그린 `#172522` / 아이보리 `#FAF7EF` |
| Lumos Lab | 민트 `#83D6C5` | 동일 |
| Lumos Admin | 라벤더 `#B9B5ED` | 동일 |

## 사용

- `components/brand/lumos-mark.tsx`의 `LumosPhotoMark`, `LumosLabMark`, `LumosAdminMark`를 사용합니다. Lab은 `frontend/src/components` 아래에 있습니다.
- 독립 SVG 원본은 각 프런트엔드 `public/brand/lumos-{photo,lab,admin}.svg`입니다. React 컴포넌트와 SVG는 동일한 도형·색상을 유지합니다.
- 사이드바 32px, 공간 선택 메뉴 24px, 인증 화면 48px를 기본 크기로 사용합니다. 정사각형 비율과 내부 여백을 유지하고 외부 배경·테두리를 중첩하지 않습니다.
- 서비스명을 함께 표시합니다. 옆의 텍스트가 이름을 제공하는 CI는 `aria-hidden`으로 중복 읽기를 방지합니다. 아이콘 단독 버튼에는 별도로 접근성 이름을 제공합니다.
- 라이트·다크 테마 모두 같은 색상을 사용합니다. 일반 메뉴·기술·SNS 아이콘은 기존 표현을 유지합니다.
- Next.js App Router의 `app/icon.svg`, `app/favicon.ico`(16/32/48px), `app/apple-icon.png`(180px)로 브라우저 탭과 홈 화면 아이콘을 제공합니다. Lab은 `frontend/src/app`에 있습니다.
- Photo·Admin의 로그인, Photo의 회원가입 화면에서도 같은 CI를 사용합니다.

세 프런트엔드는 독립 저장소이므로 공통 CI를 수정할 때 컴포넌트, 세 SVG 및 각 서비스의 파비콘을 함께 갱신합니다. 사용자에게 노출되는 UI가 없는 API·DB 저장소에는 장식용 CI를 추가하지 않습니다.

Photo 홈의 공간 안내 링크와 Lab 하단의 고정 학습 프로필에도 공통 CI를 사용합니다. 실제 회원의 프로필 사진은 유지합니다.
