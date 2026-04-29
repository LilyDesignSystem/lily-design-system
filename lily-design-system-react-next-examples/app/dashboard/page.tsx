"use client";

import { useState } from "react";
import Card from "@pgds/Card";
import Progress from "@pgds/Progress";
import ProgressCircle from "@pgds/ProgressCircle";
import Badge from "@pgds/Badge";
import Banner from "@pgds/Banner";
import DataTable from "@pgds/DataTable";
import DataTableHead from "@pgds/DataTableHead";
import DataTableBody from "@pgds/DataTableBody";
import DataTableRow from "@pgds/DataTableRow";
import DataTableTD from "@pgds/DataTableTD";

interface Task {
    id: number;
    title: string;
    assignee: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
}

const tasks: Task[] = [
    { id: 1, title: "Design landing page", assignee: "Alice", status: "done", priority: "high" },
    { id: 2, title: "Implement auth flow", assignee: "Bob", status: "in-progress", priority: "high" },
    { id: 3, title: "Write unit tests", assignee: "Carol", status: "in-progress", priority: "medium" },
    { id: 4, title: "Update documentation", assignee: "Dave", status: "todo", priority: "low" },
    { id: 5, title: "Code review", assignee: "Alice", status: "todo", priority: "medium" },
];

function statusBadgeType(status: string): "success" | "warning" | "default" {
    if (status === "done") return "success";
    if (status === "in-progress") return "warning";
    return "default";
}

export default function DashboardPage() {
    const completed = tasks.filter((t) => t.status === "done").length;
    const total = tasks.length;
    const percent = Math.round((completed / total) * 100);

    return (
        <main>
            <h1>Project Dashboard</h1>

            <Banner type="info" dismissible closeLabel="Dismiss">
                Sprint 12 ends in 5 days. {total - completed} tasks remaining.
            </Banner>

            <div className="card-grid">
                <Card heading="Sprint Progress">
                    <ProgressCircle label="Sprint completion" value={percent} />
                    <p>{completed} of {total} tasks complete</p>
                </Card>

                <Card heading="Build Status">
                    <Badge type="success">Passing</Badge>
                    <Progress label="Test coverage" value={87} max={100} />
                    <p>87% test coverage</p>
                </Card>

                <Card heading="Team Velocity">
                    <p>12 story points completed this week</p>
                    <Badge type="info">On track</Badge>
                </Card>
            </div>

            <h2>Task List</h2>
            <DataTable label="Sprint tasks">
                <DataTableHead>
                    <DataTableRow>
                        <th>Title</th>
                        <th>Assignee</th>
                        <th>Status</th>
                        <th>Priority</th>
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                    {tasks.map((task) => (
                        <DataTableRow key={task.id}>
                            <DataTableTD>{task.title}</DataTableTD>
                            <DataTableTD>{task.assignee}</DataTableTD>
                            <DataTableTD>
                                <Badge type={statusBadgeType(task.status)}>
                                    {task.status}
                                </Badge>
                            </DataTableTD>
                            <DataTableTD>{task.priority}</DataTableTD>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </main>
    );
}
