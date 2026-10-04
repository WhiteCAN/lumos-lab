"use client";

import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Background, Controls, Handle, MarkerType, Position, ReactFlow, useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TechnologyIcon, type FlowIconName } from "./technology-icon";
import { useTheme } from "./theme-provider";

export type LearningNode = { id: string; label: string; detail?: string; icon?: FlowIconName; x: number; y: number; active?: boolean; completed?: boolean };
export type LearningEdge = { source: string; target: string; label?: string; dashed?: boolean; animated?: boolean };
export type LearningGraph = { nodes: LearningNode[]; edges: LearningEdge[] };
type CardNode = Node<LearningNode, "learning">;
const subscribe = () => () => {};

function LearningCard({ data }: NodeProps<CardNode>) {
  return <div aria-current={data.active ? "step" : undefined} className={`flex h-[144px] w-[200px] items-center gap-2 rounded-xl border-2 bg-card p-3 text-card-foreground shadow-sm ${data.active ? "border-sky-500 ring-2 ring-sky-500/20" : data.completed ? "border-emerald-500" : "border-border"}`}>
    {([Position.Top, Position.Right, Position.Bottom, Position.Left] as const).map(position => <Fragment key={position}><Handle id={`in-${position}`} type="target" position={position} style={{ opacity: 0 }} /><Handle id={`out-${position}`} type="source" position={position} style={{ opacity: 0 }} /></Fragment>)}
    <TechnologyIcon name={data.icon ?? "code"} className="size-8!" /><div className="min-w-0"><strong className="line-clamp-2 text-[13px] leading-5 [overflow-wrap:anywhere]">{data.label}</strong>{data.detail && <p className="mt-1 line-clamp-3 text-xs leading-4 text-muted-foreground [overflow-wrap:anywhere]">{data.detail}</p>}{data.completed && <span className="text-xs text-emerald-700 dark:text-emerald-300">완료</span>}</div>
  </div>;
}
const nodeTypes = { learning: LearningCard };

function FitOnResize({ width, layout, padding }: { width: number; layout: string; padding: number }) {
  const { fitView } = useReactFlow();
  useEffect(() => { void fitView({ padding, duration: 0 }); }, [width, layout, padding, fitView]);
  return null;
}

export function LearningFlowCanvas({ title, graph, height = 440, fitPadding = 0.16 }: { title: string; graph: LearningGraph; height?: number; fitPadding?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const { theme } = useTheme();
  useEffect(() => {
    if (!root.current) return;
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const layout = graph.nodes.map(n => `${n.id}:${n.x}:${n.y}`).join("|");
  const nodes: CardNode[] = graph.nodes.map(n => ({ id: n.id, type: "learning", position: { x: n.x, y: n.y }, data: n }));
  const edges = graph.edges.map((edge, index) => {
    const a = graph.nodes.find(n => n.id === edge.source)!;
    const b = graph.nodes.find(n => n.id === edge.target)!;
    const horizontal = Math.abs(b.x - a.x) > Math.abs(b.y - a.y);
    const from = horizontal ? (b.x > a.x ? Position.Right : Position.Left) : (b.y > a.y ? Position.Bottom : Position.Top);
    const to = horizontal ? (b.x > a.x ? Position.Left : Position.Right) : (b.y > a.y ? Position.Top : Position.Bottom);
    return { ...edge, id: `${edge.source}-${edge.target}-${index}`, sourceHandle: `out-${from}`, targetHandle: `in-${to}`, type: "smoothstep", markerEnd: {type: MarkerType.ArrowClosed, color:"#0284c7"}, style: {stroke:"#0284c7",strokeWidth:2,strokeDasharray:edge.dashed ? "6 4" : undefined}, labelStyle: {fill:"#0c4a6e",fontSize:11}, labelBgStyle:{fill:"#f0f9ff"}, labelBgPadding:[5,3] as [number,number] };
  });
  return <div ref={root} className="min-w-0 max-w-full" data-learning-flow>
    <div role="group" aria-label={`${title} React Flow 구성도`} className="overflow-hidden rounded-lg border bg-muted/20" style={{height}}>
      {width > 0 && <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{padding:fitPadding}} minZoom={0.2} maxZoom={1.5} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} nodesFocusable={false} edgesFocusable={false} zoomOnScroll={false} zoomOnDoubleClick={false} preventScrolling={false} deleteKeyCode={null} colorMode={hydrated ? theme : "light"}>
        <Background gap={20} /><Controls showInteractive={false} aria-label={`${title} 확대·축소·전체 보기`} /><FitOnResize width={width} layout={layout} padding={fitPadding} />
      </ReactFlow>}
    </div>
    <details className="mt-2 text-xs leading-6"><summary className="cursor-pointer">구성 요소와 연결을 글로 보기</summary>
      <ul className="mt-2 space-y-1">{graph.nodes.map(n=><li key={n.id}><strong>{n.label}</strong>{n.detail ? ` · ${n.detail}` : ""}</li>)}</ul>
      <ul className="mt-2 space-y-1">{graph.edges.map((e,i)=><li key={i}>{graph.nodes.find(n=>n.id===e.source)?.label} → {graph.nodes.find(n=>n.id===e.target)?.label}{e.label ? ` · ${e.label}` : ""}</li>)}</ul>
    </details>
  </div>;
}
