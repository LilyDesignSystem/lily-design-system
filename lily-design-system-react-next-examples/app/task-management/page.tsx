"use client";

import { useState } from "react";
import TaskList from "@lily/TaskList";
import TaskListItem from "@lily/TaskListItem";
import CheckboxInput from "@lily/CheckboxInput";
import TextInput from "@lily/TextInput";
import Button from "@lily/Button";
import Badge from "@lily/Badge";
import Progress from "@lily/Progress";

interface Task {
    id: number;
    title: string;
    done: boolean;
    priority: "low" | "medium" | "high";
}

const initialTasks: Task[] = [
    { id: 1, title: "Set up project repository", done: true, priority: "high" },
    { id: 2, title: "Draft API specification", done: true, priority: "high" },
    { id: 3, title: "Design database schema", done: false, priority: "medium" },
    { id: 4, title: "Write integration tests", done: false, priority: "medium" },
    { id: 5, title: "Prepare deployment scripts", done: false, priority: "low" },
];

function priorityBadgeType(p: string): "error" | "warning" | "info" {
    if (p === "high") return "error";
    if (p === "medium") return "warning";
    return "info";
}

export default function TaskManagementPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [newTitle, setNewTitle] = useState("");
    const [showCompleted, setShowCompleted] = useState(true);

    const completedCount = tasks.filter((t) => t.done).length;
    const percent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    const visibleTasks = showCompleted ? tasks : tasks.filter((t) => !t.done);

    function addTask() {
        if (!newTitle.trim()) return;
        const next: Task = {
            id: Date.now(),
            title: newTitle.trim(),
            done: false,
            priority: "medium",
        };
        setTasks([...tasks, next]);
        setNewTitle("");
    }

    function toggleTask(id: number, done: boolean) {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, done } : t)));
    }

    return (
        <main>
            <h1>Task Management</h1>

            <div>
                <Badge type="success" label={`${completedCount} completed`}>
                    {completedCount} done
                </Badge>
                <Badge type="default" label={`${tasks.length - completedCount} remaining`}>
                    {tasks.length - completedCount} remaining
                </Badge>
            </div>

            <Progress label="Overall completion" value={percent} max={100} />
            <p>{percent}% complete</p>

            <div>
                <TextInput
                    label="New task title"
                    value={newTitle}
                    onChange={setNewTitle}
                    placeholder="Enter a task..."
                />
                <Button onClick={addTask}>Add Task</Button>
            </div>

            <div>
                <CheckboxInput
                    label="Show completed tasks"
                    checked={showCompleted}
                    onChange={setShowCompleted}
                />
                <span>Show completed</span>
            </div>

            <TaskList label="Project tasks">
                {visibleTasks.map((task) => (
                    <TaskListItem
                        key={task.id}
                        label={task.title}
                        checked={task.done}
                        onChange={(done) => toggleTask(task.id, done)}
                    />
                ))}
            </TaskList>

            <h2>Priority Overview</h2>
            <div>
                {["high", "medium", "low"].map((p) => (
                    <Badge key={p} type={priorityBadgeType(p)} label={`${p} priority tasks`}>
                        {p}: {tasks.filter((t) => t.priority === p).length}
                    </Badge>
                ))}
            </div>
        </main>
    );
}
