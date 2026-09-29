import { ActivityIcon } from "lucide-react";
import { ReferencePage, FlowSection, CodeBlock } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/observability");
export default function ObservabilityPage() {
  return <ReferencePage pageHref="/observability" label="Spring Boot · 장애 원인 좁히기" brand="spring" icon={ActivityIcon} colorClass="bg-emerald-50/50 dark:bg-emerald-950/20" description="CPU가 정상이어도 DB 풀 대기와 외부 호출 때문에 API가 느려질 수 있습니다. 평균만 보지 말고 요청 분포와 호출 구간을 함께 확인합니다.">
    <div className="grid gap-4 lg:grid-cols-3">{[["Logs · 사건", "구조화된 로그에 시각·수준·서비스·trace ID·업무 상태를 남깁니다. 예외의 스택과 원인을 보존하고 비밀번호·토큰·개인정보는 기록하지 않습니다."],["Metrics · 추세", "요청 수·실패율·지연 분포와 JVM·GC·DB 풀·소비 지연을 관찰합니다. userId·전체 URL처럼 값 종류가 많은 라벨은 시계열을 폭증시킬 수 있습니다."],["Traces · 요청 경로", "요청이 각 서비스·DB·외부 API에서 보낸 시간을 span으로 연결합니다. 샘플링과 문맥 전파 누락 때문에 모든 요청이 완전하게 보이는 것은 아닙니다."]].map(([title,text])=><article key={title} className="rounded-xl border bg-card p-5"><h2 className="font-semibold">{title}</h2><p className="mt-3 text-sm leading-7">{text}</p></article>)}</div>
    <FlowSection title="5초 응답을 좁히는 조사 순서" steps={["알림·영향 범위", "오류율·p95·p99", "느린 trace의 span", "연결된 로그·DB 풀", "원인 수정·재발 확인"]} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-xl font-semibold">평균이 숨기는 느린 요청</h2><p className="mt-3 text-sm leading-7">기본 표본은 200ms 19개와 5000ms 1개입니다. 평균은 440ms, nearest-rank p95는 200ms, p99는 5000ms입니다. 표본 수와 계산법에 따라 percentile 값이 달라집니다. 표본을 [200,200,5000]으로 줄여 비교하고 []로 입력 오류를 확인하세요.</p><p className="mt-3 text-sm leading-7">임계값은 초과(엄격히 큰 값)만 집계합니다. 응답의 rate는 0~1 비율입니다. 운영 히스토그램의 추정 percentile과 이 정확한 표본 계산을 구분하며, 서버별 p95를 평균 내 전체 p95로 취급하지 않습니다.</p></section>
    <CodeBlock title="Java · nearest-rank의 인덱스" code={`var sorted = samples.stream().sorted().toList();
int index = (int) Math.ceil(sorted.size() * 0.95) - 1;
int p95 = sorted.get(index);`} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-xl font-semibold">수집과 대응 연결</h2><p className="mt-3 text-sm leading-7">Spring Boot Actuator는 관리용 엔드포인트를, Micrometer는 계측 추상화를 제공합니다. Prometheus는 지표 수집·조회, Grafana는 시각화에 활용합니다. 모든 Actuator 엔드포인트를 공개하지 말고 노출 범위와 인증을 설정합니다. 알림은 사용자 영향과 지속 시간·오류 예산에 연결하고 담당자·대응 절차를 정합니다.</p></section>
    <div className="flex flex-wrap gap-4 text-sm underline"><a href="https://www.instagram.com/p/DdZWBVRDXxI/">14번 원문 · 캡션·표지 확인</a><a href="https://docs.micrometer.io/micrometer/reference/concepts/histogram-quantiles.html">Micrometer percentile</a><a href="https://opentelemetry.io/docs/concepts/signals/">OpenTelemetry 신호</a><a href="/architecture/microservices">마이크로서비스</a></div>
  </ReferencePage>;
}
