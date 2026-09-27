import type { Metadata } from "next";
import Link from "next/link";
import { PackageIcon } from "lucide-react";
import { CodeBlock, FlowSection, ReferencePage } from "@/components/reference-page";

export const metadata: Metadata = { title: "Docker 이미지 최적화 | Lumos Lab", description: "이미지 크기를 줄이는 10가지 방법, 레이어 삭제와 캐시 차이, dockerignore 및 측정 방법을 정리합니다." };

const tips = [
  ["작고 적절한 베이스 선택", "크기", "slim, Alpine, distroless 등을 검토하되 라이브러리·libc·디버깅 도구 호환성을 먼저 확인합니다. 가장 작은 이미지가 항상 적합하지는 않습니다."],
  ["멀티스테이지 빌드", "크기", "빌드 도구를 첫 단계에 두고 최종 이미지에는 필요한 산출물만 복사합니다."],
  [".dockerignore 사용", "컨텍스트", "Git 이력, 로컬 의존성, 비밀 파일 등을 빌드 컨텍스트에서 제외합니다. COPY 대상에 들어갈 파일도 줄지만 그 자체가 모든 레이어를 줄이지는 않습니다."],
  ["필요한 파일만 COPY", "크기", "무조건 저장소 전체를 복사하지 않고 앱·설정·산출물 등 런타임에 필요한 경로를 명시합니다."],
  ["필수 패키지만 설치", "크기", "최종 단계에 개발 도구·디버거를 남기지 않습니다. Debian 계열은 --no-install-recommends로 불필요한 권장 패키지를 줄일 수 있습니다."],
  ["캐시와 임시 파일 정리", "레이어", "설치와 정리를 같은 RUN에서 수행합니다. Python의 pip --no-cache-dir처럼 캐시 생성을 줄이는 옵션도 검토합니다."],
  ["빌드·실행 의존성 분리", "크기", "컴파일러와 헤더는 빌드 단계, 실행 라이브러리는 런타임 단계에 둡니다. 실행에 필요한 의존성까지 제거하지 않습니다."],
  ["Dockerfile 순서 최적화", "빌드 속도", "의존성 선언 파일을 먼저 복사·설치하고 자주 바뀌는 코드를 나중에 복사합니다. 주된 효과는 캐시 재사용이지 최종 크기 감소가 아닙니다."],
  ["이미지와 레이어 조사", "진단", "docker image ls와 docker history로 큰 레이어를 찾습니다. 명령 수만 줄이기보다 어떤 파일이 포함됐는지 확인합니다."],
  ["변경마다 측정", "검증", "같은 플랫폼·기능 조건에서 하나씩 바꿔 크기·빌드 시간·실행 결과를 비교합니다. 최초 빌드와 캐시 빌드 시간도 구분합니다."],
];

export default function DockerImageOptimizationPage() {
  return <ReferencePage breadcrumb="레퍼런스 / Docker 이미지 최적화" label="크기 · 캐시 · 실행 검증" title="Docker 이미지 최적화" icon={PackageIcon}
    description="목표는 실행에 필요한 파일만 담는 것입니다. 원본의 10가지 방법을 크기 감소, 빌드 컨텍스트, 캐시 속도, 검증으로 나누어 실제 효과와 주의점을 함께 정리합니다."
    colorClass="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20">
    <FlowSection title="측정하면서 줄이는 순서" steps={["현재 크기 측정", "큰 레이어 확인", "한 가지 원인 개선", "재빌드와 실행 확인", "같은 조건으로 비교"]} />
    <section aria-label="이미지 최적화 10가지" className="grid gap-4 md:grid-cols-2">{tips.map(([title, effect, text], index) => <article key={title} className="rounded-xl border bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold">{String(index + 1).padStart(2, "0")} · {title}</h2><span className="rounded-md border bg-muted px-2 py-1 text-xs">{effect}</span></div><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p></article>)}</section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-xl font-semibold">나중에 지워도 앞선 레이어는 남습니다</h2><p className="mt-3 text-sm leading-7">각 레이어는 파일시스템 변경을 기록합니다. 다음 RUN에서 삭제하면 최종 화면에서 안 보이게 할 수 있지만, 이전 레이어에 저장된 데이터 크기를 없애지는 못합니다. 비밀 파일은 처음부터 COPY하지 않아야 합니다.</p></section>
    <div className="grid min-w-0 gap-4 xl:grid-cols-2">
      <CodeBlock title="피할 패턴 · 캐시를 만든 뒤 다른 레이어에서 삭제" code={'RUN apt-get update && apt-get install -y curl\nRUN rm -rf /var/lib/apt/lists/*'} />
      <CodeBlock title="개선 패턴 · 필요한 설치와 정리를 같은 RUN에" code={'RUN apt-get update \\\n    && apt-get install -y --no-install-recommends curl \\\n    && rm -rf /var/lib/apt/lists/*'} />
    </div>
    <div className="grid min-w-0 gap-4 xl:grid-cols-2">
      <CodeBlock title=".dockerignore · 프로젝트에 맞춰 조정" code={'.git\n.env\n.env.*\n!.env.example\nnode_modules\n.next\n*.log\n__pycache__'} />
      <CodeBlock title="Python 예시 · 소스만 바뀌면 의존성 레이어 재사용" code={'WORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY app/ ./app/'} />
    </div>
    <p className="rounded-xl border bg-card p-5 text-sm leading-7">위 코드는 Dockerfile 일부이며 단독 실행 예제가 아닙니다. 베이스 이미지와 실행 명령은 앱에 맞게 구성하세요. .dockerignore에서 테스트·문서·빌드 설정을 무조건 제외하면 빌드나 검증이 깨질 수 있습니다. 비밀값이 필요한 빌드는 이미지에 값을 복사하지 않고 BuildKit secret mount를 사용합니다.</p>
    <CodeBlock title="변경 전후 기록할 명령 · 기존·개선 Dockerfile을 각각 지정" code={'docker build -f Dockerfile.before -t app:before .\ndocker build -f Dockerfile.after -t app:after .\ndocker image ls app\ndocker image inspect app:before app:after --format "{{.RepoTags}} {{.Size}}"\ndocker history app:after'} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">비교할 때 함께 기록할 것</h2><ul className="mt-3 space-y-2 text-sm leading-7"><li>같은 CPU 플랫폼, 앱 버전, 실행 기능을 기준으로 비교합니다.</li><li>로컬 이미지 크기와 레지스트리의 압축 전송 크기는 다를 수 있습니다.</li><li>캐시를 재사용한 빌드와 캐시 없이 수행한 빌드 시간을 구분합니다.</li><li>포트·시작 명령·파일 권한·네이티브 모듈·인증서가 정상 동작하는지 확인합니다.</li><li>원본의 GB/MB 수치는 예시입니다. 작은 이미지도 취약할 수 있어 업데이트와 취약점 검사는 별도로 필요합니다.</li></ul></section>
    <section className="rounded-xl border bg-card p-5 text-sm leading-7"><h2 className="text-lg font-semibold">이어서 보기 · 출처</h2><p className="mt-3"><Link className="underline" href="/docker-multi-stage">Docker 멀티스테이지 빌드</Link> · <Link className="underline" href="/ci-cd">CI/CD 가이드</Link></p><p className="mt-3"><a className="underline" href="https://www.instagram.com/reels/Ddv9bn_JLPz/" target="_blank" rel="noreferrer">원본 릴스 · Rani</a> · <a className="underline" href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noreferrer">Docker 빌드 권장 사항</a> · <a className="underline" href="https://docs.docker.com/build/cache/optimize/" target="_blank" rel="noreferrer">캐시 최적화</a> · <a className="underline" href="https://docs.docker.com/build/building/secrets/" target="_blank" rel="noreferrer">빌드 비밀값</a></p></section>
  </ReferencePage>;
}
