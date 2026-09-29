import Link from "next/link";
import { WorkflowIcon } from "lucide-react";
import { ComparisonTable, FlowSection, ReferencePage } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/devops-toolchain");

const roles = [
  { name: "Linux · 실행 기반", question: "프로세스가 왜 시작되지 않거나 통신하지 못할까?", explanation: "프로세스·파일 권한·포트·로그·메모리의 기본 동작을 이해하는 층입니다. 컨테이너를 써도 호스트 자원과 네트워크 문제는 남습니다.", evidence: "프로세스 상태, 리슨 포트, 파일 소유자와 서비스 로그를 확인합니다." },
  { name: "Docker · 패키징과 실행", question: "같은 앱을 어떻게 재현 가능한 환경으로 전달할까?", explanation: "Dockerfile로 이미지를 만들고 컨테이너로 실행합니다. 이미지와 실행 중인 컨테이너는 다르며, 데이터 보존에는 볼륨 등 별도 설계가 필요합니다.", evidence: "이미지 digest, 시작 명령, 포트 매핑, 실제 HTTP 응답을 확인합니다." },
  { name: "Kubernetes · 워크로드 운영", question: "여러 서버에서 원하는 개수의 앱을 어떻게 유지할까?", explanation: "Deployment·Service 등으로 원하는 상태를 선언하고 컨트롤러가 현재 상태를 맞춥니다. Pod 재시작이 애플리케이션 오류나 데이터 손실까지 해결하지는 않습니다.", evidence: "rollout, Ready 조건, 이벤트, Service 연결과 실제 요청 결과를 확인합니다." },
  { name: "Terraform · 인프라 관리", question: "네트워크·서버 같은 자원을 어떻게 반복 가능하게 준비할까?", explanation: "provider와 구성 파일로 인프라 자원을 관리합니다. plan으로 변경을 검토하고 apply로 반영합니다. state 접근 권한과 동시 작업 제어도 운영 대상입니다.", evidence: "계획한 변경과 반영 결과, state 관리 방식을 확인합니다. 민감 값이 state에 포함될 수 있습니다." },
  { name: "Jenkins · 전달 자동화", question: "여러 도구와 환경의 빌드·테스트를 어떻게 연결할까?", explanation: "Jenkinsfile의 Pipeline으로 단계를 정의합니다. agent에서 작업을 실행하며 플러그인, 실행 노드, 자격 증명과 서버 자체를 관리해야 합니다.", evidence: "실패 단계, 테스트 결과, 후속 단계 중단과 발행 산출물을 확인합니다." },
  { name: "GitHub Actions · 저장소 이벤트 자동화", question: "PR·push 이벤트에서 어떤 검증을 실행할까?", explanation: "workflow 안의 job과 step을 runner에서 실행합니다. needs로 의존 관계를 정하고 독립 job은 병렬 실행할 수 있습니다. 배포 후 검증은 별도 단계로 설계합니다.", evidence: "이벤트와 커밋 SHA, job 의존성, 로그와 배포 버전을 함께 확인합니다." },
];

export default function DevopsToolchainPage() {
  return <ReferencePage pageHref="/devops-toolchain" label="도구의 역할부터 이해하기" icon={WorkflowIcon}
    description="Linux, Docker, Kubernetes, Terraform, Jenkins, GitHub Actions를 역할과 산출물로 비교합니다. 여섯 도구는 고정된 실행 순서가 아니며, 프로젝트의 운영 복잡도에 맞게 선택합니다."
    colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
    <section className="grid gap-4 lg:grid-cols-2" aria-label="DevOps 도구별 역할">
      {roles.map((role) => <article key={role.name} className="rounded-lg border bg-card p-5">
        <h2 className="text-lg font-semibold">{role.name}</h2><p className="mt-2 font-medium text-sky-700 dark:text-sky-300">{role.question}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{role.explanation}</p><p className="mt-3 rounded-md bg-muted/60 p-3 text-sm leading-6">확인할 증거: {role.evidence}</p>
      </article>)}
    </section>
    <div className="grid gap-4 lg:grid-cols-2">
      <FlowSection title="인프라를 준비하는 흐름" orientation="vertical" steps={["Terraform 구성·변경 검토", "네트워크·서버·클러스터 준비", "실행 환경 접근·상태 확인"]} colorClass="bg-card" />
      <FlowSection title="애플리케이션을 전달하는 흐름" orientation="vertical" steps={["코드 변경·PR", "Jenkins 또는 GitHub Actions 검증", "이미지 빌드·레지스트리 발행", "실행 환경에 버전 반영", "사용자 요청·로그·지표 검증"]} colorClass="bg-card" />
    </div>
    <ComparisonTable columns={["흔한 혼동", "구분 기준"]} rows={[
      { topic: "도입 순서", values: ["여섯 도구를 모두 직렬로 도입", "역할 지도입니다. 작은 서비스는 단일 서버와 간단한 CI로 시작할 수 있습니다."] },
      { topic: "CI 선택", values: ["Jenkins 다음에 Actions가 필수", "같은 자동화 영역의 선택지입니다. 연동할 수 있지만 둘 다 필요하지는 않습니다."] },
      { topic: "컨테이너 실행", values: ["Kubernetes는 반드시 Docker Engine 사용", "CRI 호환 런타임(예: containerd)을 사용합니다. 이미지 빌드 도구와 클러스터 런타임을 구분합니다."] },
      { topic: "배포 완료", values: ["이미지 push 성공이면 끝", "원하는 버전 반영, 준비 상태, 실제 HTTP 경로를 확인해야 합니다."] },
    ]} />
    <section className="rounded-lg border bg-card p-5">
      <h2 className="text-xl font-semibold">실습: 검증 결과가 후속 단계를 결정하기</h2>
      <p className="mt-3 text-sm leading-6">상단 API 실습은 서버에서 숫자의 합과 기대값을 비교합니다. 기본 입력은 합계 6으로 passed=true, fail=true는 합에 1을 더해 passed=false가 됩니다. parameter를 7로 바꿔도 기본 합계와 달라 실패합니다. 검증 실패는 정상적으로 계산된 결과이므로 HTTP 200이며, 요청 형식·입력 제한 오류의 HTTP 400과 구분하세요.</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">ScenarioLabController.run() → ScenarioLabService.pipeline()의 actual, expected, passed와 분기문에 브레이크포인트를 둡니다. 결과의 ‘배포 단계 실행’은 로그 문자열입니다. 실제 Jenkins·Actions 실행, Docker 빌드, Terraform apply, Kubernetes 배포는 수행하지 않습니다. values는 -10000~10000의 정수 1~30개, parameter는 -10000~10000입니다. values를 빈 배열로 보내면 입력 검증 실패를 확인할 수 있습니다.</p>
    </section>
    <section className="rounded-lg border bg-card p-5">
      <h2 className="text-xl font-semibold">이어서 실습하기</h2>
      <div className="mt-3 flex flex-wrap gap-4 text-sm underline underline-offset-4"><Link href="/ci-cd">CI/CD 단계와 완료 증거</Link><Link href="/docker-multi-stage">Docker 다단계 빌드</Link><Link href="/docker-image-optimization">이미지 최적화</Link></div>
    </section>
    <section className="rounded-lg border bg-card p-5 text-sm leading-6">
      <h2 className="text-xl font-semibold">출처와 확인 범위</h2>
      <p className="mt-3"><a className="underline" href="https://www.instagram.com/reels/DdwqRFhN3pr/" target="_blank" rel="noreferrer">learndevopstogether 원문 릴스</a>의 캡션에 있는 여섯 도구와 역할을 확인해 재구성했습니다. 영상 전체 전사나 명령 실행 결과의 재현은 아닙니다. 도구의 연결 관계는 아래 공식 문서로 보완했습니다.</p>
      <div className="mt-3 flex flex-wrap gap-4 underline"><a href="https://docs.docker.com/get-started/docker-overview/">Docker 개요</a><a href="https://kubernetes.io/docs/concepts/overview/">Kubernetes 개요</a><a href="https://kubernetes.io/docs/setup/production-environment/container-runtimes/">컨테이너 런타임</a><a href="https://developer.hashicorp.com/terraform/intro">Terraform 소개</a><a href="https://www.jenkins.io/doc/book/pipeline/">Jenkins Pipeline</a><a href="https://docs.github.com/en/actions/get-started/understand-github-actions">GitHub Actions</a></div>
    </section>
  <p className="text-sm"><a className="underline" href="/kubernetes-deployment">Kubernetes apply 이후 흐름과 Service·Ingress 실습</a></p>
</ReferencePage>;
}
