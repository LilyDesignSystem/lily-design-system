import { mount } from "svelte";
import MarkdownEditor from "../MarkdownEditor.svelte";

const labels = {
    heading: "Heading", bold: "Bold", italic: "Italic", strikethrough: "Strikethrough", code: "Code",
    link: "Link", quote: "Quote", bulletList: "Bulleted list", numberedList: "Numbered list",
};

mount(MarkdownEditor, {
    target: document.getElementById("app")!,
    props: { label: "Message", toolbarLabel: "Formatting", labels, value: "hello world", name: "body" },
});
