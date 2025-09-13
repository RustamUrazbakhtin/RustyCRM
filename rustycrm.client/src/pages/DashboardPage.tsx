import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Calendar from "../components/Calendar";
import "./Dashboard.css";

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <div className="card kpi">
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
            {sub && <div className="kpi-sub">{sub}</div>}
        </div>
    );
}

function MiniWidget({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="card mini">
            <div className="card-title">{title}</div>
            <div className="card-body">{children}</div>
        </div>
    );
}

function AnalyticsWidget() {
    // проста€ заглушка аналитики с Ђспарклайномї (SVG), без сторонних либ
    const points = [10, 14, 12, 16, 18, 22, 21, 27, 26, 30, 28, 35];
    const w = 560, h = 240, step = w / (points.length - 1);
    const max = Math.max(...points), min = Math.min(...points);
    const toY = (v: number) => h - ((v - min) / (max - min)) * h;
    const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step},${toY(p)}`).join(" ");

    return (
        <div className="analytics">
            <div className="analytics-header">
                <div>
                    <div className="title">Revenue (demo)</div>
                    <div className="muted">Last 12 periods</div>
                </div>
                <div className="pill">+12.4%</div>
            </div>
            <svg width={w} height={h} className="spark">
                <path d={path} fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="legend">
                <div className="dot" /> Current period
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [mode, setMode] = useState<"calendar" | "analytics">("calendar");

    return (
        <div className="dashboard-wrap">
            <NavBar />
            <div className="dashboard">
                {/* ¬ерхние KPI */}
                <div className="kpi-row">
                    <KpiCard label="New Leads" value="128" sub="+18% vs last wk" />
                    <KpiCard label="Active Deals" value="42" sub="7 closing this wk" />
                    <KpiCard label="Revenue MTD" value="$48,200" sub="+12.4%" />
                </div>

                {/* Ѕольшой центральный виджет */}
                <div className="main-card card">
                    <div className="main-header">
                        <div className="tabs">
                            <button
                                className={`tab ${mode === "calendar" ? "active" : ""}`}
                                onClick={() => setMode("calendar")}
                            >
                                Calendar
                            </button>
                            <button
                                className={`tab ${mode === "analytics" ? "active" : ""}`}
                                onClick={() => setMode("analytics")}
                            >
                                Analytics
                            </button>
                        </div>
                    </div>

                    <div className="main-body">
                        {mode === "calendar" ? <Calendar /> : <AnalyticsWidget />}
                    </div>
                </div>

                {/* ѕрава€ колонка мини-виджетов */}
                <div className="side-col">
                    <MiniWidget title="Tasks (today)">
                        <ul className="list">
                            <li>Call Acme Inc. Ч Q4 scope</li>
                            <li>Send contract to Globex</li>
                            <li>Prepare demo for Friday</li>
                        </ul>
                    </MiniWidget>

                    <MiniWidget title="Upcoming meetings">
                        <ul className="list">
                            <li>Tue 11:00 Ч Sprint planning</li>
                            <li>Wed 15:00 Ч Client kickoff</li>
                            <li>Thu 10:30 Ч Marketing sync</li>
                        </ul>
                    </MiniWidget>
                </div>
            </div>
        </div>
    );
}
