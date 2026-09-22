import Link from "next/link";
import { RouteIcon } from "lucide-react";
import { ReferencePage, FlowSection, ComparisonTable } from "@/components/reference-page";

import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/algorithm-patterns");

const patterns = [
  { name: "Two Pointers · 투 포인터", signal: "정렬된 배열의 쌍, 양끝 비교, 중복 제거", idea: "두 위치를 관리하며 조건에 따라 한쪽 또는 양쪽 포인터를 이동합니다.", example: "정렬된 배열에서 목표 합을 만드는 두 수, 회문 검사", cost: "두 포인터가 각각 한 방향으로만 진행하면 O(n). 정렬이 필요하면 정렬 비용이 추가됩니다.", caution: "포인터를 움직일 때 후보를 버려도 되는 이유를 설명해야 합니다. 모든 투 포인터 문제가 정렬을 요구하는 것은 아닙니다." },
  { name: "Sliding Window · 슬라이딩 윈도우", signal: "연속 구간의 합·빈도·최장 또는 최단 길이", idea: "오른쪽 끝을 늘리고 필요한 만큼 왼쪽 끝을 줄이며 구간 상태를 갱신합니다.", example: "길이 k의 최대 구간 합, 중복 없는 최장 부분 문자열", cost: "각 원소가 한 번 들어오고 한 번 나가며 갱신이 O(1)이면 O(n).", caution: "음수가 있는 합 조건은 단순 확장·축소 규칙이 깨질 수 있습니다. 연속 구간이라는 이유만으로 적용하지 않습니다." },
  { name: "Fast & Slow Pointers · 빠른·느린 포인터", signal: "연결 리스트의 순환·중간 위치, 반복 상태의 주기", idea: "한 포인터는 한 칸, 다른 포인터는 두 칸씩 움직여 만남이나 종료를 관찰합니다.", example: "연결 리스트 사이클 탐지, 중간 노드 찾기", cost: "리스트 사이클 탐지는 시간 O(n), 추가 공간 O(1).", caution: "빠른 포인터와 다음 노드의 null을 확인합니다. 첫 만남 지점이 곧 사이클 시작점은 아닙니다." },
  { name: "Merge Intervals · 구간 병합", signal: "겹치는 시간·범위의 통합", idea: "시작점으로 정렬한 뒤 직전 구간과 겹치면 끝점을 확장합니다.", example: "예약 시간 통합, 겹치는 구간 병합", cost: "일반적으로 정렬 O(n log n) + 순회 O(n).", caution: "끝점이 같은 두 구간을 합칠지는 닫힌 구간·반열린 구간 등 문제의 정의에 달려 있습니다." },
  { name: "DFS · 깊이 우선 탐색", signal: "연결 요소, 도달 가능성, 트리·그래프 전체 탐색", idea: "한 갈래를 깊이 탐색한 뒤 돌아와 아직 방문하지 않은 이웃을 살핍니다.", example: "섬 개수, 트리 순회, 경로 존재 확인", cost: "인접 리스트와 방문 표시를 쓰면 시간 O(V+E), 추가 공간 O(V).", caution: "순환 그래프는 방문 처리가 필요합니다. 깊은 재귀는 스택 한계에 닿을 수 있고 최단 경로를 자동 보장하지 않습니다." },
  { name: "BFS · 너비 우선 탐색", signal: "동일 비용 간선에서 최소 이동 횟수, 레벨별 탐색", idea: "큐를 사용해 시작점에서 가까운 정점부터 차례로 탐색합니다.", example: "격자 최단 거리, 트리 레벨 순회", cost: "인접 리스트에서 시간 O(V+E), 추가 공간 O(V).", caution: "가중치가 서로 다르면 일반 BFS로 최단 비용을 구할 수 없습니다. 보통 큐에 넣을 때 방문 표시해 중복 삽입을 막습니다." },
  { name: "Binary Search · 이진 탐색", signal: "정렬된 탐색 공간 또는 참·거짓이 한 번 바뀌는 조건", idea: "중간값을 검사해 답이 없는 절반을 제외하고 경계를 좁힙니다.", example: "정렬 배열 검색, 첫·마지막 위치, 최소 가능 용량", cost: "검사가 O(1)이면 O(log n). 결정 함수가 O(f(n))이면 전체 비용에 이를 곱합니다.", caution: "정렬 여부뿐 아니라 조건의 단조성을 확인합니다. 구간의 포함 여부와 종료 시 반환할 경계를 일관되게 정합니다." },
  { name: "Dynamic Programming · 동적 계획법", signal: "중복 부분 문제, 작은 상태에서 큰 상태로 이어지는 관계", idea: "상태·점화식·초깃값을 정하고 결과를 저장해 재계산을 줄입니다.", example: "계단 오르기, 동전 교환, 최장 증가 부분 수열", cost: "대체로 상태 수 × 상태당 전이 비용. 문제와 점화식에 따라 다릅니다.", caution: "DP 자체가 특정 복잡도를 뜻하지 않습니다. 상태에 필요한 정보를 빠뜨리거나 계산 순서를 틀리면 재사용한 값도 잘못됩니다." },
  { name: "Backtracking · 백트래킹", signal: "조합·순열·배치 등 가능한 선택 탐색", idea: "선택하고 탐색한 뒤 선택을 취소합니다. 불가능한 가지는 일찍 중단합니다.", example: "N-Queens, 순열 생성, 스도쿠", cost: "후보 수에 따라 지수·팩토리얼 규모가 될 수 있습니다. 가지치기가 항상 다항 시간을 만들지는 않습니다.", caution: "상태 복원과 중복 후보 처리를 확인합니다. 그래프 DFS의 전역 방문 처리와 현재 경로의 선택 상태를 구분합니다." },
  { name: "Topological Sort · 위상 정렬", signal: "선수 조건·빌드 순서처럼 선후 관계가 있는 작업", idea: "진입 차수가 0인 정점부터 처리하거나 DFS의 종료 순서를 이용합니다.", example: "수강 순서, 의존성이 있는 빌드 작업", cost: "인접 리스트에서 시간 O(V+E), 추가 공간 O(V).", caution: "유향 비순환 그래프에서 가능합니다. Kahn 방식에서 처리한 정점 수가 V보다 적으면 사이클이 있습니다. 결과는 여러 개일 수 있습니다." },
];

export default function AlgorithmPatternsPage() {
  return <ReferencePage pageHref="/algorithm-patterns" label="10개 패턴 · 선택 신호 · 복잡도"
    description="문제 이름을 외우기보다 입력의 구조와 제약을 읽고, 탐색 범위를 줄이거나 계산을 재사용할 방법을 선택합니다."
    icon={RouteIcon} colorClass="border-cyan-200 bg-cyan-50/50 dark:border-cyan-900/60 dark:bg-cyan-950/20">
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">패턴은 후보, 적용 조건이 판단 기준</h2><p className="mt-2 text-sm leading-6">원문에 소개된 10개 패턴을 한국어로 재구성했습니다. 복잡도와 반례는 학습용 보완입니다. 여러 패턴을 조합할 수 있으며 이 목록만으로 모든 문제를 해결할 수 있는 것은 아닙니다. n은 입력 크기, V와 E는 정점·간선 수입니다.</p></section>
    <section className="grid gap-4 lg:grid-cols-2" aria-label="알고리즘 패턴 10개">{patterns.map((p,i)=><article key={p.name} className="rounded-xl border bg-card p-5"><p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">PATTERN {String(i+1).padStart(2,"0")}</p><h2 className="mt-2 text-lg font-semibold">{p.name}</h2><p className="mt-3 text-sm leading-6"><strong>선택 신호 · </strong>{p.signal}</p><p className="mt-2 text-sm leading-6">{p.idea}</p><p className="mt-2 text-sm leading-6"><strong>예시 · </strong>{p.example}</p><p className="mt-2 text-sm leading-6"><strong>복잡도 · </strong>{p.cost}</p><p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">{p.caution}</p></article>)}</section>
    <section><h2 className="mb-3 text-xl font-semibold">같은 그래프, 다른 방문 순서</h2><p className="mb-4 text-sm leading-6">간선은 A→B, A→C, B→D, C→E이며 이웃은 B, C 순서로 살핍니다. 아래는 방문 순서 예시로, 동일한 시점의 실행 상태를 비교하는 그림은 아닙니다.</p><div className="grid gap-4 xl:grid-cols-2">
      <FlowSection orientation="vertical" title="DFS · 한 갈래부터 깊게" steps={[{label:"A 방문",icon:"search"},{label:"B 방문",icon:"branch"},{label:"D 방문",icon:"done"},{label:"되돌아와 C 방문",icon:"branch"},{label:"E 방문",icon:"done"}]} />
      <FlowSection orientation="vertical" title="BFS · 가까운 레벨부터" steps={[{label:"A 방문 · 거리 0",icon:"search"},{label:"B 방문 · 거리 1",icon:"branch"},{label:"C 방문 · 거리 1",icon:"branch"},{label:"D 방문 · 거리 2",icon:"done"},{label:"E 방문 · 거리 2",icon:"done"}]} />
    </div></section>
    <ComparisonTable columns={["판단 기준", "먼저 검토할 패턴"]} rows={[
      {topic:"배열·문자열",values:["연속 구간인가? 정렬되어 있는가?","슬라이딩 윈도우 / 투 포인터"]},
      {topic:"탐색 공간 축소",values:["반쪽을 버릴 근거나 단조 조건이 있는가?","이진 탐색"]},
      {topic:"그래프",values:["최소 간선 수인가, 도달·순회인가, 선후 관계인가?","BFS / DFS / 위상 정렬"]},
      {topic:"경우의 수·최적화",values:["같은 상태가 반복되는가, 모든 선택을 생성해야 하는가?","DP / 백트래킹 (조합 가능)"]},
    ]} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">문제를 풀기 전 확인할 순서</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6"><li>입력 크기, 정렬 여부, 음수·중복·사이클·가중치를 확인합니다.</li><li>완전 탐색의 비용을 계산하고 반복되는 계산이나 버릴 후보를 찾습니다.</li><li>상태·불변식·이동 규칙을 정해 패턴이 성립하는 이유를 설명합니다.</li><li>빈 입력, 원소 하나, 경계값과 적용 조건이 깨지는 반례를 확인합니다.</li></ol></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처와 함께 읽기</h2><ul className="mt-3 space-y-2 text-sm"><li><a className="underline" href="https://www.instagram.com/reels/DdWGjaHSBo4/">원문 · softwaredeveloper_077의 10 Coding Interview Patterns</a></li><li><Link className="underline" href="/datastructures/graph">그래프 탐색: BFS·DFS</Link></li><li><Link className="underline" href="/datastructures/queue">큐</Link></li><li><Link className="underline" href="/search">검색 알고리즘</Link></li></ul></section>
  </ReferencePage>;
}
