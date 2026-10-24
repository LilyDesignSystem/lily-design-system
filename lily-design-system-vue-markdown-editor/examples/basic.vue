<script setup lang="ts">
import { ref } from "vue";
import MarkdownEditor from "../MarkdownEditor.vue";

const body = ref("Hello **world**");
const labels = {
  heading: "Heading", bold: "Bold", italic: "Italic", strikethrough: "Strikethrough", code: "Code",
  link: "Link", quote: "Quote", bulletList: "Bulleted list", numberedList: "Numbered list",
};
</script>

<template>
  <form>
    <MarkdownEditor v-model="body" label="Message" toolbar-label="Formatting" :labels="labels" name="body" :rows="8" />
    <button type="submit">Send</button>
    <pre>{{ body }}</pre>
  </form>
</template>
