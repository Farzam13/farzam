"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
const scoreData = [{name:"Retrieval",value:92},{name:"Citation",value:88},{name:"Graph",value:90}];
export function Dashboard() {
  return <main className="p-6 grid gap-6 md:grid-cols-2">
    <section className="rounded-xl bg-slate-900 p-4"><h2 className="font-semibold">AI Readiness Scores</h2><div className="h-64"><ResponsiveContainer><BarChart data={scoreData}><XAxis dataKey="name"/><YAxis/><Bar dataKey="value" fill="#60a5fa"/></BarChart></ResponsiveContainer></div></section>
    <section className="rounded-xl bg-slate-900 p-4"><h2 className="font-semibold">Entity Graph Visualization</h2><div className="h-64"><ReactFlow nodes={[{id:"1",position:{x:0,y:0},data:{label:"Entity A"}},{id:"2",position:{x:180,y:100},data:{label:"Entity B"}}]} edges={[{id:"e1-2",source:"1",target:"2"}]} fitView /></div></section>
    <section className="rounded-xl bg-slate-900 p-4 md:col-span-2"><h2 className="font-semibold">Schema Preview</h2><pre className="text-xs overflow-auto">{`{"@context":"https://schema.org","@graph":[]}`}</pre></section>
  </main>;
}
