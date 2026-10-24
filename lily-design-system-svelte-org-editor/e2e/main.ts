import { mount } from "svelte";
import OrgEditor from "../OrgEditor.svelte";

const labels = {
    heading: "Heading", promote: "Promote", demote: "Demote", todo: "Task", priority: "Priority",
    scheduled: "Scheduled", deadline: "Deadline", timestamp: "Timestamp", bold: "Bold", italic: "Italic",
    underline: "Underline", strikethrough: "Strikethrough", code: "Code", verbatim: "Verbatim", link: "Link",
    bulletList: "Bulleted list", numberedList: "Numbered list", checkbox: "Checkbox", quote: "Quote",
    sourceBlock: "Source block", property: "Property", drawer: "Drawer", contact: "Contact",
};

mount(OrgEditor, {
    target: document.getElementById("app")!,
    props: { label: "Notes", toolbarLabel: "Formatting", labels, value: "* Ship the release", today: "2026-10-24", name: "notes" },
});
