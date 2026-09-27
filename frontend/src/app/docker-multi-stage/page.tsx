import type { Metadata } from "next";
import Link from "next/link";
import { BoxesIcon } from "lucide-react";
import { CodeBlock, FlowSection, ReferencePage } from "@/components/reference-page";

export const metadata: Metadata = { title: "Docker 멀티스테이지 빌드 | Lumos Lab", description: "빌드 도구와 실행 환경을 분리하고 필요한 산출물만 복사하는 Docker 다단계 빌드 학습 페이지입니다." };

const example = `# 독립적인 Java 21 학습 예시: 같은 폴더에 Main.java 필요
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY Main.java .
RUN javac -d /out Main.java

FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app
COPY --from=build /out/ ./
USER 10001:10001
CMD ["java", "-cp", "/app", "Main"]`;

export default function DockerMultiStagePage() {
  return <ReferencePage breadcrumb="레퍼런스 / Docker 멀티스테이지 빌드" label="빌드와 실행 환경 분리" title="Docker 멀티스테이지 빌드" icon={BoxesIcon}
    description="소스를 컴파일하는 데 필요한 도구와 완성된 프로그램을 실행하는 데 필요한 파일은 다릅니다. 여러 FROM으로 단계를 나누고 최종 이미지에는 실행에 필요한 산출물만 남깁니다."
    colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
    <section className="grid gap-4 lg:grid-cols-2" aria-label="단일 단계와 다단계 비교">
      <article className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">단일 단계 · 빌드 환경을 그대로 배포</h2><ul className="mt-3 space-y-2 text-sm leading-7"><li>소스 + 컴파일러 + 빌드 도구 + 의존성 + 산출물</li><li>구성은 단순하지만 실행에 필요 없는 파일도 남기기 쉽습니다.</li><li>다음 RUN에서 파일을 지워도 앞선 이미지 레이어의 데이터는 사라지지 않습니다.</li></ul></article>
      <article className="rounded-xl border border-sky-200 bg-sky-50/40 p-5 dark:border-sky-900 dark:bg-sky-950/20"><h2 className="text-lg font-semibold">다단계 · 실행 환경을 별도로 구성</h2><ul className="mt-3 space-y-2 text-sm leading-7"><li>빌드 단계: 소스, 컴파일러와 빌드 의존성</li><li>실행 단계: 런타임과 선택한 산출물</li><li>COPY --from=build로 필요한 파일만 옮깁니다.</li></ul></article>
    </section>
    <FlowSection title="최종 이미지에 남는 것" steps={["소스와 빌드 도구 준비", "build 단계에서 컴파일", "산출물만 COPY --from", "runtime 단계가 최종 이미지"]} />
    <div className="grid min-w-0 gap-4 xl:grid-cols-2">
      <CodeBlock title="Dockerfile · JDK에서 컴파일하고 JRE에서 실행" code={example} />
      <section className="min-w-0 rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">명령어별 의미</h2><dl className="mt-4 space-y-4 text-sm leading-7">{[["FROM … AS build", "첫 단계를 build라는 이름으로 참조합니다. 컴파일에 필요한 JDK를 사용합니다."], ["RUN javac", "Main.java를 /out 디렉터리의 클래스 파일로 컴파일합니다."], ["두 번째 FROM", "새 파일시스템에서 실행 단계를 시작합니다. 첫 단계의 파일이 자동으로 따라오지 않습니다."], ["COPY --from=build", "앞 단계의 /out만 가져옵니다. JDK·소스·임시 파일은 최종 이미지에 포함하지 않습니다."], ["USER / CMD", "비루트 사용자로 전환하고 Main 클래스를 실행합니다. 실행 중 파일 쓰기가 필요하면 디렉터리 권한도 맞춰야 합니다."]].map(([term, description]) => <div key={term}><dt className="font-semibold">{term}</dt><dd className="mt-1 text-muted-foreground">{description}</dd></div>)}</dl></section>
    </div>
    <CodeBlock title="함께 저장할 Main.java" code={'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, multi-stage!");\n    }\n}'} />
    <CodeBlock title="별도 실습 폴더에서 실행할 명령" code={'docker build --target build -t java-demo:build .\ndocker build -t java-demo:runtime .\ndocker run --rm java-demo:runtime\ndocker image ls java-demo\ndocker history java-demo:runtime'} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">작아졌다는 것과 올바르게 실행된다는 것은 별도 확인</h2><ul className="mt-3 space-y-3 text-sm leading-7"><li>원본의 1.2GB → 87MB는 설명용 사례이며 이 예시의 측정 결과가 아닙니다. 언어·베이스 이미지·의존성에 따라 결과가 달라집니다.</li><li>최종 이미지에 컴파일러가 없어도 런타임 라이브러리, 인증서, 시간대 데이터 등은 필요할 수 있습니다. 실제 실행으로 확인합니다.</li><li>멀티스테이지는 빌드 시간을 항상 줄이지 않습니다. 캐시와 단계 간 의존 관계를 따로 설계해야 합니다.</li><li>태그는 갱신될 수 있습니다. 재현성이 필요하면 검증한 digest를 고정하고 보안 업데이트 절차를 함께 둡니다.</li><li>이 코드는 독립 학습용입니다. 현재 프로젝트의 Dockerfile이나 배포 구성을 변경하지 않습니다.</li></ul></section>
    <section className="rounded-xl border bg-card p-5 text-sm leading-7"><h2 className="text-lg font-semibold">이어서 보기 · 출처</h2><p className="mt-3"><Link className="underline" href="/docker-image-optimization">Docker 이미지 최적화 10가지</Link> · <Link className="underline" href="/ci-cd">CI/CD 가이드</Link></p><p className="mt-3"><a className="underline" href="https://www.instagram.com/reels/DdwJpqGKEir/" target="_blank" rel="noreferrer">원본 릴스</a> · <a className="underline" href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noreferrer">Docker 공식 다단계 빌드</a> · <a className="underline" href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noreferrer">Docker 빌드 권장 사항</a></p></section>
  </ReferencePage>;
}
