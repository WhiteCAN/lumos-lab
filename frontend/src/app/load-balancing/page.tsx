import { NetworkIcon } from "lucide-react";
import { ReferencePage, ComparisonTable, CodeBlock } from "@/components/reference-page";
import { LearningFlowCanvas } from "@/components/learning-flow-canvas";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/load-balancing");
export default function LoadBalancingPage() {
  return <ReferencePage pageHref="/load-balancing" label="부하 분산 · 선택 기준" icon={NetworkIcon} colorClass="bg-sky-50/50 dark:bg-sky-950/20" description="동일한 기능을 제공하는 서버 중 어느 서버로 요청을 보낼지 결정합니다. 서버 수, 상태 검사, 세션 저장 위치를 함께 설계해야 합니다.">
    <LearningFlowCanvas motion="flow" title="요청을 처리 가능한 서버로 분산" height={470} graph={{nodes:[{id:"client",label:"클라이언트",icon:"user",x:0,y:0},{id:"lb",label:"로드밸런서",icon:"server",x:0,y:160},...[0,1,2].map(i=>({id:`s${i}`,label:`서버 ${i}`,icon:"server" as const,x:(i-1)*330,y:330}))],edges:[{source:"client",target:"lb"},...[0,1,2].map(i=>({source:"lb",target:`s${i}`,label:"선택된 서버로 전달"}))]}} />
    <div className="grid gap-4 lg:grid-cols-3">{[["L4", "IP·포트와 연결 정보를 중심으로 분산합니다. HTTP 경로별 라우팅과 구분합니다."],["L7", "HTTP host·path·헤더 등을 기준으로 라우팅할 수 있습니다. TLS 종료 위치와 전달 헤더 신뢰 범위를 정해야 합니다."],["고가용성", "로드밸런서 자체의 중복 구성과 상태 검사도 필요합니다. 서버 한 대의 로컬 세션에 의존하면 다른 서버로 이동할 때 문제가 생깁니다."]].map(([title,text])=><article key={title} className="rounded-xl border bg-card p-5"><h2 className="font-semibold">{title}</h2><p className="mt-3 text-sm leading-7">{text}</p></article>)}</div>
    <ComparisonTable columns={["선택 기준", "주의점"]} rows={[
      {topic:"Round Robin",values:["대상을 순서대로 선택", "요청 수가 같아도 작업량은 다를 수 있음"]},
      {topic:"Least Connections",values:["활성 연결이 적은 대상", "연결 수가 CPU 사용량·남은 작업량과 같지는 않음"]},
      {topic:"Weighted Round Robin",values:["설정한 가중치 비율", "서버 용량 변화에 맞는 가중치 관리 필요"]},
      {topic:"IP Hash",values:["클라이언트 IP 기반 대상", "NAT 뒤 사용자가 한 서버에 몰릴 수 있음"]},
    ]} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-xl font-semibold">실습 비교</h2><p className="mt-3 text-sm leading-7">connections=[8,0,2], requests=6으로 두 strategy를 비교하세요. round-robin은 [0,1,2,0,1,2], least-connections는 [1,1,1,2,1,2]로 배정합니다. 리스트를 비우거나 잘못된 strategy를 넣으면 400입니다. 이 실습은 모든 서버를 정상으로 가정하며 연결이 종료되지 않습니다. 응답 속도 벤치마크가 아닙니다.</p></section>
    <CodeBlock title="Java · 최소 연결 서버 선택 핵심" code={`int selected = loads.indexOf(Collections.min(loads));
assignments.add(selected);
loads.set(selected, loads.get(selected) + 1);
// 이 예제에서는 동률일 때 낮은 인덱스를 선택합니다.`} />
    <p className="text-sm leading-7">7번 게시물의 요청 분산·알고리즘·L4/L7 도표를 확인해 정리했습니다. 부하 분산이 모든 과부하를 막아 주지는 않습니다. 대기열·요청 제한·DB 병목도 따로 검토해야 합니다.</p>
    <div className="flex flex-wrap gap-4 text-sm underline"><a href="https://www.instagram.com/p/DdgS4sKFHkI/?img_index=2">7번 원문 · 도표 확인</a><a href="https://nginx.org/en/docs/http/load_balancing.html">NGINX 공식 설명</a><a href="/backend/waiting-room">접속 대기열</a><a href="/kubernetes-deployment#network">Kubernetes 네트워크</a></div>
  </ReferencePage>;
}
