<script setup lang="ts">
import { ref, computed } from "vue";

interface Task {
    id: number;
    title: string;
    done: boolean;
    priority: "low" | "medium" | "high";
}

const tasks = ref<Task[]>([
    { id: 1, title: "Set up project repository", done: true, priority: "high" },
    { id: 2, title: "Draft API specification", done: true, priority: "high" },
    { id: 3, title: "Design database schema", done: false, priority: "medium" },
    { id: 4, title: "Write integration tests", done: false, priority: "medium" },
    { id: 5, title: "Prepare deployment scripts", done: false, priority: "low" },
]);
const newTitle = ref("");
const showCompleted = ref(true);

const completedCount = computed(() => tasks.value.filter((t) => t.done).length);
const percent = computed(() =>
    tasks.value.length > 0 ? Math.round((completedCount.value / tasks.value.length) * 100) : 0
);
const visibleTasks = computed(() =>
    showCompleted.value ? tasks.value : tasks.value.filter((t) => !t.done)
);

function priorityBadgeType(p: string): string {
    if (p === "high") return "error";
    if (p === "medium") return "warning";
    return "info";
}

function addTask() {
    if (!newTitle.value.trim()) return;
    tasks.value.push({
        id: Date.now(),
        title: newTitle.value.trim(),
        done: false,
        priority: "medium",
    });
    newTitle.value = "";
}

function toggleTask(id: number) {
    const task = tasks.value.find((t) => t.id === id);
    if (task) task.done = !task.done;
}
</script>

<template>
    <main class="page-wrapper">
        <h1>Task Management</h1>

        <div class="section">
            <Badge type="success">{{ completedCount }} done</Badge>
            <Badge>{{ tasks.length - completedCount }} remaining</Badge>
        </div>

        <Progress label="Overall completion" :value="percent" :max="100" />
        <p>{{ percent }}% complete</p>

        <div class="section">
            <TextInput label="New task title" v-model="newTitle" placeholder="Enter a task..." />
            <Button @click="addTask">Add Task</Button>
        </div>

        <div class="section">
            <CheckboxInput label="Show completed tasks" :checked="showCompleted" @change="showCompleted = !showCompleted" />
            <span>Show completed</span>
        </div>

        <TaskList label="Project tasks">
            <TaskListItem
                v-for="task in visibleTasks"
                :key="task.id"
                :label="task.title"
                :checked="task.done"
                @change="toggleTask(task.id)"
            >
                <Badge :type="priorityBadgeType(task.priority)">{{ task.priority }}</Badge>
            </TaskListItem>
        </TaskList>

        <h2>Priority Overview</h2>
        <div>
            <Badge v-for="p in ['high', 'medium', 'low']" :key="p" :type="priorityBadgeType(p)">
                {{ p }}: {{ tasks.filter((t) => t.priority === p).length }}
            </Badge>
        </div>
    </main>
</template>
