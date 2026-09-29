import { BoxesIcon } from "lucide-react";
import { ReferencePage, FlowSection, CodeBlock, ComparisonTable } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";
import { DebugLab } from "@/components/debug-lab";

export const metadata = getStudyMetadata("/kubernetes-deployment");
export default function KubernetesDeploymentPage() {
  return <ReferencePage pageHref="/kubernetes-deployment" label="Kubernetes · 제어 루프" brand="kubernetes" icon={BoxesIcon} colorClass="bg-blue-50/50 dark:bg-blue-950/20" description="kubectl apply는 컨테이너를 직접 실행하지 않습니다. API에 선언한 희망 상태를 여러 제어 루프가 실제 상태로 수렴시킵니다.">
    <FlowSection title="배포 요청에서 트래픽 수신까지" steps={["kubectl → API Server", "인증·인가·admission·저장", "Deployment → ReplicaSet", "ReplicaSet → Pod 객체", "Scheduler → 노드 배정", "Kubelet·CRI·네트워크 준비", "컨테이너 실행·Ready 검사"]} />
    <ComparisonTable columns={["책임", "문제가 생겼을 때"]} rows={[
      {topic:"API Server / etcd", values:["요청 처리와 상태 저장. etcd는 컨테이너 실행기가 아님", "권한·admission·스키마 오류, API 이벤트 확인"]},
      {topic:"Controller",values:["Deployment가 ReplicaSet 관리, ReplicaSet 컨트롤러가 Pod 수 조정", "희망 복제 수와 실제 수·롤아웃 조건 비교"]},
      {topic:"Scheduler",values:["미배정 Pod의 노드 결정. 컨테이너를 직접 시작하지 않음", "CPU·메모리·taint·affinity로 Pending 가능"]},
      {topic:"Kubelet / runtime",values:["노드에서 Pod sandbox·이미지·컨테이너 수명 관리", "이미지 인증·pull 실패·프로세스 종료 확인"]},
      {topic:"Readiness",values:["트래픽을 받을 준비가 됐는지 별도 판단", "Running이어도 Ready=false일 수 있음"]},
    ]} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-xl font-semibold">API 실습 읽는 법</h2><p className="mt-3 break-words text-sm leading-7">desired는 희망 Pod 수, current는 현재 Pod 객체 수, slots는 전체 노드 배정 용량입니다. 5·2·3이면 3개 생성이 필요하고 2개는 미배정으로 남습니다. imageAvailable=false이면 배정돼도 실행하지 못합니다. readinessPass=false이면 Running과 Ready가 달라집니다. 숫자를 11로 바꾸면 HTTP 400입니다.</p><p className="mt-3 break-words text-sm leading-7">현재·희망 수 차이와 단계별 조건을 계산하는 Java 모형입니다. 실제 Kubernetes에 요청하거나 Pod를 생성하지 않습니다. 실제 Pod phase의 Pending은 스케줄링 이후 이미지 준비 과정도 포함할 수 있습니다. 응답의 pending은 이 모형의 미배정 수만 뜻합니다.</p></section>
    <CodeBlock title="실제 클러스터에서 관찰할 명령 · 자동 실행하지 않음" code={`kubectl apply -f deployment.yaml
kubectl get deployment,replicaset,pods
kubectl describe pod <pod-name>
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl rollout status deployment/<name>`} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-xl font-semibold">원문의 단순화를 보완하면</h2><p className="mt-3 break-words text-sm leading-7">배포 단계는 단일 동기 함수가 아니라 API를 통해 협력하는 제어 루프입니다. 네트워크 준비를 모든 컨테이너 실행 뒤에 고정된 단계로 단정하지 않습니다. Docker Engine을 Kubernetes의 기본 CRI 런타임으로 간주하지 않으며 containerd·CRI-O 등 CRI 구현을 구분합니다. Pod Running은 건강·서비스 준비 완료를 보장하지 않습니다.</p><div className="mt-4 flex flex-wrap gap-4 text-sm underline"><a href="https://www.instagram.com/reels/Dd1mbLxhaem/">3번 원문 · 캡션 확인</a><a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/">공식 Pod lifecycle</a><a href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/">공식 Deployment</a></div></section>
    <section id="network" className="space-y-5">
      <h2 className="break-words text-2xl font-semibold">Deployment·Service·Ingress 연결하기</h2>
      <div className="grid gap-4 lg:grid-cols-3">{[
        ["Deployment", "복제 수와 Pod template을 선언합니다. selector.matchLabels와 template.metadata.labels가 일치해야 합니다. containerPort 선언 자체가 프로세스를 실행하거나 외부에 포트를 공개하지 않습니다."],
        ["Service", "selector로 Pod를 선택하고 port를 targetPort로 연결합니다. 기본적인 서비스 트래픽 대상은 Ready endpoint입니다. Running이라는 이유만으로 모두 트래픽을 받지는 않습니다."],
        ["Ingress", "host·path와 Service 이름·포트를 연결하는 규칙입니다. Ingress 객체만 만들면 동작하는 것이 아니며 이를 처리하는 컨트롤러, DNS와 필요하면 TLS 설정이 있어야 합니다."],
      ].map(([title,text]) => <article key={title} className="rounded-xl border bg-card p-5"><h3 className="font-semibold">{title}</h3><p className="mt-3 break-words text-sm leading-7">{text}</p></article>)}</div>
      <FlowSection title="논리적 요청 경로 · 구현에 따라 Pod endpoint로 직접 전달 가능" steps={["클라이언트 · lab.example", "Ingress controller · host/path", "Service · selector/port", "Ready Pod · targetPort"]} />
      <CodeBlock title="설정 연결점 발췌 · 완전한 배포 파일 아님" code={`# Deployment의 Pod template
metadata:
  labels: { app: lab }
# Service
spec:
  selector: { app: lab }
  ports: [{ port: 80, targetPort: 8080 }]
# Ingress의 http.paths 항목
path: /
pathType: Prefix
backend:
  service:
    name: lab-service
    port: { number: 80 }`} />
      <DebugLab lab={{title:"라우팅 조건 API 실습",endpoint:"/api/labs/kubernetes-route",initial:{host:"lab.example",selector:"lab",podLabel:"lab",ready:true,controllerPresent:true},breakpoint:"learning/ReconcileLabController.java → route()",note:"host·label·ready·controllerPresent를 하나씩 바꿔 끊기는 지점을 확인합니다. 빈 host는 400입니다. 단일 조건 모형이며 실제 클러스터와 통신하지 않습니다."}} />
      <p className="text-sm leading-7">복제 수 3만으로 고가용성을 보장하지 않습니다. 노드 분산·프로브·용량도 필요합니다. 원문의 오래된 이미지 태그는 배포 추천으로 사용하지 않습니다. Ingress의 기능 확장은 동결되어 있으므로 신규 설계에서는 Gateway API도 검토합니다.</p>
      <div className="flex flex-wrap gap-4 text-sm underline"><a href="https://www.instagram.com/reels/Ddz5snCB9Pe/">5번 원문 · 캡션 확인</a><a href="https://kubernetes.io/docs/concepts/services-networking/service/">Service 공식 문서</a><a href="https://kubernetes.io/docs/concepts/services-networking/ingress/">Ingress 공식 문서</a></div>
    </section>
  </ReferencePage>;
}
