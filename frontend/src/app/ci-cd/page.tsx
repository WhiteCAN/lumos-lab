import type { Metadata } from "next";
import Link from "next/link";
import { GitBranchIcon } from "lucide-react";
import { ComparisonTable, FlowSection, ReferencePage } from "@/components/reference-page";

export const metadata: Metadata = {
  title: "CI/CD | Lumos Lab",
  description: "커밋부터 테스트, 이미지 발행, 스테이징 배포와 운영 검증까지의 학습 가이드",
};

const projects = [
  { title: "1. 첫 CI 파이프라인", goal: "커밋을 자동으로 빌드하고 실패 원인을 찾습니다.", tasks: "이벤트 → workflow → job → step 관계를 익히고, 런타임과 의존성을 고정합니다. Node 프로젝트는 lockfile과 npm ci로 설치합니다.", evidence: "실습 브랜치에서 빌드를 일부러 깨뜨린 뒤, 실패한 step의 최초 원인을 고쳐 다시 통과시키기" },
  { title: "2. Pull Request 검증", goal: "문제가 있는 변경이 기준 브랜치에 합쳐지지 않게 합니다.", tasks: "PR에서 빌드·테스트·lint를 실행하고 저장소 ruleset 또는 브랜치 보호에 필수 상태 검사를 연결합니다. CI 파일만 추가한다고 병합이 차단되지는 않습니다.", evidence: "실패한 필수 검사로 병합이 차단되고, 수정 후 허용되는지 확인하기" },
  { title: "3. 자동 테스트", goal: "동작과 의존 시스템 연결을 검증합니다.", tasks: "단위·통합·E2E 테스트의 역할을 나눕니다. 독립적인 job은 병렬로, 의존 단계는 순차로 실행하고 테스트 데이터와 서비스를 격리합니다.", evidence: "실패 시 후속 단계 중단, 테스트 리포트 보관, 재실행해도 일관된 결과 확인하기" },
  { title: "4. 아티팩트와 버전", goal: "어떤 코드에서 나온 산출물인지 추적합니다.", tasks: "JAR·웹 산출물에 커밋 SHA, 빌드 번호와 실행 이력을 연결합니다. 검증한 산출물 자체를 다음 환경으로 승격하고 보관 정책에 복구용 버전을 포함합니다.", evidence: "배포 버전 → 산출물 → CI 실행 → 원본 커밋을 역추적하기" },
  { title: "5. 애플리케이션 컨테이너화", goal: "실행 환경과 애플리케이션을 이미지로 묶습니다.", tasks: "Dockerfile의 FROM·WORKDIR·COPY·RUN·EXPOSE·CMD를 이해하고, 다단계 빌드와 .dockerignore를 사용합니다. 가능하면 비루트 사용자로 실행합니다.", evidence: "로컬 컨테이너의 포트 매핑, 시작 명령, 로그와 실제 HTTP 응답 확인하기" },
  { title: "6. CI에서 이미지 빌드", goal: "수작업 없이 추적 가능한 이미지를 만듭니다.", tasks: "테스트 통과 뒤 이미지를 만들도록 의존 관계를 설정합니다. 빌드 컨텍스트를 최소화하고 변경 빈도가 낮은 의존성 계층부터 캐시합니다.", evidence: "이미지 실행 테스트와 digest 기록, 캐시 사용 여부 및 잘못된 컨텍스트 진단하기" },
  { title: "7. 레지스트리 발행", goal: "배포 환경이 검증한 이미지를 가져갈 수 있게 합니다.", tasks: "GHCR 등에서 push 권한과 배포 환경의 pull 권한을 구분합니다. CI Secret 또는 지원되는 단기 자격 증명을 쓰고 토큰을 코드·이미지·로그에 남기지 않습니다.", evidence: "깨끗한 실습 환경에서 정확한 digest를 pull하고 인증 실패·권한 부족·없는 태그를 구분하기" },
  { title: "8. 보안 검사", goal: "보안 결과가 배포 허용 여부에 반영되게 합니다.", tasks: "의존성 검사, 이미지 취약점 검사, Secret 탐지, SAST를 구분합니다. DAST는 허가된 실행 환경에서 수행합니다. 위험도·수정 가능성·악용 가능성을 고려해 차단 기준을 정합니다.", evidence: "발견 → 판단 → 수정 → 재검사 기록하기. 예외는 담당자·사유·만료일을 남기고 실제 비밀 유출이면 먼저 폐기·교체하기" },
  { title: "9. 스테이징 자동 배포", goal: "운영 전 환경에서 정확한 배포 버전을 검증합니다.", tasks: "Deployment는 Pod 교체, Service는 접근 경로, ConfigMap은 일반 설정, Secret은 민감 설정을 담당합니다. 운영 데이터와 자격 증명은 분리합니다.", evidence: "rollout 완료, Ready 상태, 로그, 이미지 digest, 실제 API·화면 스모크 테스트를 함께 확인하기" },
];

const pitfalls = [
  ["SHA 태그를 붙이면 불변인가요?", "태그는 이름이라 덮어쓸 수 있습니다. 저장소의 불변 태그 정책을 확인하고 정확한 이미지 고정에는 digest를 사용합니다. latest나 development만으로는 배포 이력을 특정하기 어렵습니다."],
  ["빌드는 한 번만 해야 하나요?", "같은 릴리스의 환경 승격에서는 검증한 산출물을 재사용한다는 뜻입니다. 보안 패치와 의존성 갱신은 새 릴리스로 다시 빌드·검증합니다. Next.js의 NEXT_PUBLIC_*처럼 빌드 시 고정되는 값은 환경별 재사용 설계에 주의합니다."],
  ["EXPOSE가 외부 포트를 열어 주나요?", "아닙니다. 컨테이너가 사용할 포트를 문서화합니다. 로컬 실행에는 포트 publish, Kubernetes에서는 Service 등의 별도 네트워크 구성이 필요합니다."],
  ["Kubernetes Secret이면 자동으로 암호화되나요?", "base64는 암호화가 아닙니다. 저장 시 암호화 설정, 최소 권한 RBAC, 접근 범위와 순환 정책이 별도로 필요합니다. 값을 Git에 넣지 않습니다."],
  ["CI 초록색이면 배포 완료인가요?", "빌드·테스트 성공은 배포 성공과 다릅니다. 레지스트리 발행, 배포 반영, 새 Pod 준비, 실제 사용자 경로 검증을 각각 확인해야 합니다."],
  ["이미지를 push하면 실행 중인 Pod도 바뀌나요?", "아닙니다. 같은 태그를 push하거나 imagePullPolicy: Always를 지정하는 것만으로 기존 Pod가 교체되지는 않습니다. 원하는 이미지 버전이 Pod 템플릿에 반영되는 배포 경로가 필요합니다."],
  ["실패하면 항상 자동 롤백되나요?", "일반 Kubernetes Deployment는 진행 실패를 보고하지만 자동 롤백을 보장하지 않습니다. 중단·복구 정책을 별도로 설계합니다. 이미지 롤백이 DB 변경까지 되돌려 주지는 않습니다."],
];

export default function CiCdPage() {
  return (
    <ReferencePage breadcrumb="레퍼런스 / CI/CD" label="소프트웨어 전달 과정" title="CI/CD · 커밋에서 운영까지" icon={GitBranchIcon}
      description="VERIQTA 게시물의 표지와 본문 10장(전체 흐름 + 실습 9개)을 바탕으로 재구성한 학습 노트입니다. 명령어 암기보다 각 단계의 산출물, 실패 지점, 통과 증거를 중심으로 봅니다. 이 페이지는 정적 가이드이며 실제 배포를 실행하지 않습니다."
      colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
      <ComparisonTable columns={["CI", "Continuous Delivery", "Continuous Deployment"]} rows={[
        { topic: "목적", values: ["변경을 자주 통합하고 자동 검증", "항상 배포 가능한 릴리스 준비", "검증된 변경을 운영까지 자동 배포"] },
        { topic: "운영 반영", values: ["CI 자체의 필수 범위는 아님", "운영 배포 결정에 수동 승인 가능", "자동화된 정책·검증을 통과하면 반영"] },
        { topic: "핵심 증거", values: ["빌드·테스트·품질 검사 결과", "검증된 산출물과 배포 준비 상태", "배포 후 실제 서비스 상태"] },
      ]} />
      <FlowSection title="전체 전달 흐름" steps={[{ label: "커밋·PR", icon: "github" }, { label: "빌드·테스트", icon: "code" }, { label: "보안 검사", icon: "verify" }, { label: "아티팩트·이미지", icon: "docker" }, { label: "레지스트리", icon: "server" }, { label: "스테이징 검증", icon: "verify" }, { label: "승인·운영 배포", icon: "kubernetes" }, { label: "관찰·피드백", icon: "search" }]} colorClass="bg-card" />
      <section aria-labelledby="projects-title" className="rounded-lg border bg-card p-4">
        <h2 id="projects-title" className="text-xl font-semibold">작은 실습 9개로 나누기</h2>
        <p className="mt-2 text-sm text-muted-foreground">고장 내는 연습은 개인 실습 브랜치와 격리된 환경에서만 합니다.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <article key={project.title} className="rounded-lg border p-4">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm font-medium text-sky-700 dark:text-sky-300">{project.goal}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.tasks}</p>
              <p className="mt-3 rounded-md bg-muted/60 p-3 text-sm leading-6"><span className="font-semibold">완료 증거: </span>{project.evidence}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-xl font-semibold">Lumos Lab의 현재 설정과 연결</h2>
        <ul className="mt-3 grid gap-3 text-sm leading-6 text-muted-foreground">
          <li><code>.github/workflows/ci.yml</code>: PR 및 main/development push에서 백엔드 테스트와 프론트엔드 npm ci·lint·build를 별도 job으로 실행합니다.</li>
          <li><code>.github/workflows/publish-images.yml</code>: 해당 경로의 development 변경 또는 수동 실행으로 두 이미지를 SHA·development 태그로 GHCR에 발행합니다.</li>
          <li>두 workflow 사이에는 CI 성공을 기다리는 연결이 명시되어 있지 않습니다. 이미지 발행을 CI 통과 증거로 간주하면 안 됩니다.</li>
          <li><code>backend/k8s/dev</code>와 <code>frontend/k8s/dev</code>, 각 <code>argocd/dev</code>에 개발 배포 설정이 있습니다. 설정 파일의 존재는 실제 서버 배포 완료를 뜻하지 않습니다.</li>
          <li>이 학습 정리에서는 보안 게이트·운영 승인·자동 롤백을 구현하거나 원격 배포 상태를 확인하지 않았습니다.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-4 text-sm underline underline-offset-4">
          <Link href="/testing-basics">테스트 기본 개념</Link><Link href="/tdd">TDD 학습</Link><Link href="/project-structure">프로젝트 구조</Link>
        </div>
      </section>
      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-xl font-semibold">자주 헷갈리는 운영 포인트</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {pitfalls.map(([question, answer]) => (
            <article key={question} className="rounded-lg border p-4"><h3 className="font-semibold">{question}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p></article>
          ))}
        </div>
      </section>
      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-xl font-semibold">스테이징 다음에 공부할 것</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">캡션은 운영 승인, blue-green·canary, 모니터링과 롤백까지 예고하지만, 이 캐러셀 본문은 스테이징 배포까지입니다. 다음 확장에서는 승인 책임자, 점진적 트래픽 전환, 오류율·지연시간 중단 기준, DB 하위 호환성과 복구 절차를 먼저 정의합니다. 원문에서 확인하지 못한 후속 자료를 읽은 것으로 취급하지 않습니다.</p>
      </section>
      <section className="rounded-lg border bg-card p-4 text-sm leading-6">
        <h2 className="text-lg font-semibold">출처와 추가 읽기</h2>
        <ul className="mt-3 grid gap-2 underline underline-offset-4">
          <li><a href="https://www.instagram.com/p/DchrR8mjvxm/" target="_blank" rel="noreferrer">VERIQTA · CI/CD Production Projects 원문</a></li>
          <li><a href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noreferrer">Docker · 이미지 빌드와 버전 고정</a></li>
          <li><a href="https://kubernetes.io/docs/concepts/configuration/secret/" target="_blank" rel="noreferrer">Kubernetes · Secret 보안</a></li>
          <li><a href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" target="_blank" rel="noreferrer">Kubernetes · Deployment 진행과 복구</a></li>
        </ul>
      </section>
    </ReferencePage>
  );
}
