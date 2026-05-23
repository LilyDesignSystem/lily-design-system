<script lang="ts">
    import TaskList from "$lib/components/TaskList/TaskList.svelte";
    import TaskListItem from "$lib/components/TaskListItem/TaskListItem.svelte";
    import CheckList from "$lib/components/CheckList/CheckList.svelte";
    import CheckListItem from "$lib/components/CheckListItem/CheckListItem.svelte";
    import TextInput from "$lib/components/TextInput/TextInput.svelte";
    import CheckboxInput from "$lib/components/CheckboxInput/CheckboxInput.svelte";
    import Button from "$lib/components/Button/Button.svelte";
    import Badge from "$lib/components/Badge/Badge.svelte";
    import Progress from "$lib/components/Progress/Progress.svelte";
    import DateInput from "$lib/components/DateInput/DateInput.svelte";
    import TimeInput from "$lib/components/TimeInput/TimeInput.svelte";
    import DateRange from "$lib/components/DateRange/DateRange.svelte";
    import Editable from "$lib/components/Editable/Editable.svelte";
    import ClipboardCopyButton from "$lib/components/ClipboardCopyButton/ClipboardCopyButton.svelte";
    import DoList from "$lib/components/DoList/DoList.svelte";
    import DoListItem from "$lib/components/DoListItem/DoListItem.svelte";
    import DontList from "$lib/components/DontList/DontList.svelte";
    import DontListItem from "$lib/components/DontListItem/DontListItem.svelte";
    import Form from "$lib/components/Form/Form.svelte";
    import Field from "$lib/components/Field/Field.svelte";
    import Tag from "$lib/components/Tag/Tag.svelte";
    import TagGroup from "$lib/components/TagGroup/TagGroup.svelte";
    import Separator from "$lib/components/Separator/Separator.svelte";
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer/Footer.svelte";
    import BackLink from "$lib/components/BackLink/BackLink.svelte";

    let tasks = $state([
        {
            id: 1,
            text: "Review patient records",
            done: false,
            priority: "High",
        },
        { id: 2, text: "Update care plan", done: true, priority: "Medium" },
        {
            id: 3,
            text: "Schedule follow-up appointments",
            done: false,
            priority: "High",
        },
        {
            id: 4,
            text: "Complete training module",
            done: false,
            priority: "Low",
        },
        { id: 5, text: "Submit weekly report", done: true, priority: "Medium" },
    ]);
    let newTaskText = $state("");
    let dueDate = $state("");
    let dueTime = $state("");
    let projectTitle = $state("Q1 Care Quality Improvement");

    let completedCount = $derived(tasks.filter((t) => t.done).length);
    let progressPercent = $derived(
        Math.round((completedCount / tasks.length) * 100),
    );

    function addTask() {
        if (!newTaskText.trim()) return;
        tasks = [
            ...tasks,
            {
                id: Date.now(),
                text: newTaskText.trim(),
                done: false,
                priority: "Medium",
            },
        ];
        newTaskText = "";
    }

    function toggleTask(id: number) {
        tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    }

    function removeTask(id: number) {
        tasks = tasks.filter((t) => t.id !== id);
    }
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Task Management</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <h2>
        Project:
        <Editable label="Project title" bind:value={projectTitle} />
    </h2>

    <div
        style="display: flex; align-items: center; gap: var(--nhs-space-3); margin-bottom: var(--nhs-space-4);"
    >
        <Progress label="Task completion" value={progressPercent} max={100} />
        <Badge>{completedCount}/{tasks.length} complete</Badge>
        <ClipboardCopyButton
            text={`${projectTitle}: ${completedCount}/${tasks.length} tasks complete`}
            label="Copy progress"
        >
            Copy
        </ClipboardCopyButton>
    </div>

    <h2>Tasks</h2>
    <TaskList label="Project tasks">
        {#each tasks as task (task.id)}
            <TaskListItem
                label={task.text}
                checked={task.done}
                onchange={() => toggleTask(task.id)}
            ></TaskListItem>
        {/each}
    </TaskList>

    <h3>Add New Task</h3>
    <Form label="Add task form" onsubmit={addTask}>
        <div
            style="display: flex; gap: var(--nhs-space-2); align-items: flex-end; margin-bottom: var(--nhs-space-4);"
        >
            <Field label="Task description">
                <TextInput label="New task" bind:value={newTaskText} />
            </Field>
            <Button type="submit">Add</Button>
        </div>
    </Form>

    <h3>Schedule</h3>
    <div
        style="display: flex; gap: var(--nhs-space-3); flex-wrap: wrap; margin-bottom: var(--nhs-space-4);"
    >
        <Field label="Due date">
            <DateInput label="Due date" bind:value={dueDate} />
        </Field>
        <Field label="Due time">
            <TimeInput label="Due time" bind:value={dueTime} />
        </Field>
    </div>

    <h3>Project Timeline</h3>
    <DateRange
        label="Project duration"
        startLabel="Start date"
        endLabel="End date"
        start="2026-01-01"
        end="2026-03-31"
    />

    <Separator />

    <h2>Quality Checklist</h2>
    <CheckList label="Quality assurance checklist">
        <CheckListItem checked>Patient consent forms completed</CheckListItem>
        <CheckListItem checked>Care plan reviewed and signed</CheckListItem>
        <CheckListItem>Risk assessment updated</CheckListItem>
        <CheckListItem>Discharge summary prepared</CheckListItem>
    </CheckList>

    <Separator />

    <h2>Tags</h2>
    <TagGroup label="Task categories">
        <Tag label="Urgent"><span>Urgent</span></Tag>
        <Tag label="Clinical"><span>Clinical</span></Tag>
        <Tag label="Administrative"><span>Administrative</span></Tag>
        <Tag label="Training"><span>Training</span></Tag>
    </TagGroup>

    <Separator />

    <h2>Guidelines</h2>
    <div
        style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--nhs-space-4);"
    >
        <div>
            <h3>Do</h3>
            <DoList>
                <DoListItem>Prioritise patient safety</DoListItem>
                <DoListItem>Document all interactions</DoListItem>
                <DoListItem>Follow infection control procedures</DoListItem>
                <DoListItem>Communicate with the care team</DoListItem>
            </DoList>
        </div>
        <div>
            <h3>Don't</h3>
            <DontList>
                <DontListItem>Skip handover procedures</DontListItem>
                <DontListItem>Leave records incomplete</DontListItem>
                <DontListItem>Ignore patient feedback</DontListItem>
                <DontListItem>Bypass safety protocols</DontListItem>
            </DontList>
        </div>
    </div>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — Task Management Example</p>
    </div>
</Footer>
