"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { Background, Controls, Handle, MarkerType, Position, ReactFlow, type Node, type NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TechnologyIcon } from "./technology-icon";
import { useTheme } from "./theme-provider";
import { systemDiagrams, type DiagramNode } from "./system-diagram-data";

type ServiceNode = Node<DiagramNode & { active: boolean; selected: boolean; onSelect: () => void }, "service">;

function ServiceCard({ data }: NodeProps<ServiceNode>) {
  return <>
    <Handle id="in" type="target" position={Position.Left} className="!bg-sky-600" />
    <Handle id="request-in" type="target" position={Position.Left} style={{ top: "20%", opacity: 0 }} />
    <Handle id="response-out" type="source" position={Position.Left} style={{ top: "80%", opacity: 0 }} />
    <button type="button" aria-pressed={data.selected} onClick={data.onSelect}
      className={`nodrag nopan flex w-56 items-start gap-3 rounded-xl border-2 bg-card p-4 text-left text-card-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 ${data.selected ? "border-sky-600" : data.active ? "border-sky-300 dark:border-sky-800" : "border-border"}`}>
      <TechnologyIcon name={data.icon} />
      <span><strong className="block text-sm">{data.label}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{data.role}</span></span>
    </button>
    <Handle id="out" type="source" position={Position.Right} className="!bg-sky-600" />
    <Handle id="request-out" type="source" position={Position.Right} style={{ top: "20%", opacity: 0 }} />
    <Handle id="response-in" type="target" position={Position.Right} style={{ top: "80%", opacity: 0 }} />
  </>;
}
const nodeTypes = { service: ServiceCard };
const subscribe = () => () => {};

export function SystemDiagram({ kind }: { kind: keyof typeof systemDiagrams }) {
  const diagram = systemDiagrams[kind];
  const { theme } = useTheme();
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const titleId = useId();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(diagram.nodes[0].id);
  const [view, setView] = useState<"diagram" | "list">("diagram");
  const scene = diagram.scenes[sceneIndex];
  const selected = diagram.nodes.find((node) => node.id === selectedId)!;
  const active = new Set(scene.links.flatMap((edge) => [edge.source, edge.target]));
  const visibleNodes = diagram.nodes.filter((node) => scene.nodeIds ? scene.nodeIds.includes(node.id) : !node.id.startsWith("f"));
  const nodes: ServiceNode[] = visibleNodes.map((node) => ({
    id: node.id, type: "service", position: { x: node.x, y: node.y },
    data: { ...node, active: active.has(node.id), selected: selectedId === node.id, onSelect: () => setSelectedId(node.id) },
  }));
  const edges = scene.links.map((edge, i) => {
    const paired = scene.links.some((other) => other.source === edge.target && other.target === edge.source);
    const backwards = diagram.nodes.find((node) => node.id === edge.source)!.x > diagram.nodes.find((node) => node.id === edge.target)!.x;
    return ({
    ...edge, id: `${sceneIndex}-${i}`, type: "default", label: edge.label,
    sourceHandle: paired ? (backwards ? "response-out" : "request-out") : "out",
    targetHandle: paired ? (backwards ? "response-in" : "request-in") : "in",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#0284c7" },
    style: { stroke: "#0284c7", strokeWidth: 2 },
    labelStyle: { fill: "#0c4a6e", fontSize: 12, fontWeight: 600 },
    labelBgStyle: { fill: "#f0f9ff" }, labelBgPadding: [8, 5] as [number, number],
    });
  });
  const label = (id: string) => diagram.nodes.find((node) => node.id === id)!.label;

  return <section aria-labelledby={titleId} className="min-w-0 overflow-hidden rounded-xl border bg-card">
    <div className="space-y-3 border-b p-4 sm:p-5">
      <p className="text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-300">시스템 다이어그램 · 학습용 모형</p>
      <h2 id={titleId} className="text-xl font-semibold">{diagram.title}</h2>
      <div className="flex flex-wrap gap-2" aria-label="다이어그램 경로 선택">
        {diagram.scenes.map((item, index) => <button key={item.label} type="button" aria-pressed={sceneIndex === index} onClick={() => setSceneIndex(index)} className={`min-h-11 rounded-lg border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sky-600 ${sceneIndex === index ? "border-sky-700 bg-sky-700 text-white" : "bg-background hover:bg-muted"}`}>{item.label}</button>)}
      </div>
      <p aria-live="polite" className="min-h-16 text-sm leading-6 text-muted-foreground">{scene.summary}</p>
      <div className="hidden gap-2 md:flex">{(["diagram", "list"] as const).map((mode) => <button type="button" key={mode} aria-pressed={view === mode} onClick={() => setView(mode)} className="rounded border px-3 py-2 text-sm aria-pressed:bg-muted">{mode === "diagram" ? "구성도" : "연결 목록"}</button>)}</div>
    </div>
    {view === "diagram" && <div className="hidden h-[460px] bg-muted/20 md:block" aria-label={`${diagram.title} 구성도`}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.15 }} minZoom={0.35} maxZoom={1.5}
        nodesDraggable={false} nodesConnectable={false} nodesFocusable={false} edgesFocusable={false} elementsSelectable={false}
        zoomOnScroll={false} preventScrolling={false} deleteKeyCode={null} colorMode={hydrated ? theme : "light"}>
        <Background gap={24} color="#94a3b8" />
        <Controls showInteractive={false} aria-label="확대·축소·전체 보기" />
      </ReactFlow>
    </div>}
    <div className={view === "list" ? "p-4" : "p-4 md:hidden"}>
      <h3 className="mb-3 text-sm font-semibold">현재 경로의 연결</h3>
      <ol className="space-y-2">{scene.links.map((edge, i) => <li key={i} className="rounded-lg border bg-muted/30 p-3 text-sm leading-6"><strong>{label(edge.source)} → {label(edge.target)}</strong><span className="block text-muted-foreground">{edge.label}</span></li>)}</ol>
    </div>
    <div className="grid gap-4 border-t p-4 lg:grid-cols-[1fr_2fr]">
      <div><label htmlFor={`${titleId}-node`} className="mb-2 block text-sm font-medium">구성 요소 자세히 보기</label>
        <select id={`${titleId}-node`} value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="w-full min-w-0 rounded-lg border bg-background p-3 text-sm">{diagram.nodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}</select>
      </div>
      <div aria-live="polite" className="min-h-28 rounded-lg bg-muted/40 p-4"><h3 className="flex items-center gap-2 font-semibold"><TechnologyIcon name={selected.icon} />{selected.label}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.detail}</p></div>
    </div>
    <p className="border-t px-4 py-3 text-xs leading-5 text-muted-foreground">경로를 선택하고 구성 요소를 눌러 역할을 확인하세요. 실제 서버 상태나 API 실행 결과를 나타내는 화면은 아닙니다.</p>
  </section>;
}
