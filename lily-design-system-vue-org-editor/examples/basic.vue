<script setup lang="ts">
import { ref } from "vue";
import OrgEditor from "../OrgEditor.vue";

const notes = ref("* Ship the release");
const labels = { todo: "Task", priority: "Priority", scheduled: "Scheduled", deadline: "Deadline", property: "Property", drawer: "Drawer", contact: "Contact", bold: "Bold", italic: "Italic", link: "Link" };
</script>

<template>
  <form>
    <OrgEditor v-model="notes" label="Notes" toolbar-label="Formatting" :labels="labels" :todo-keywords="['TODO', 'NEXT', 'DONE']" name="notes" :rows="12" />
    <button type="submit">Save</button>
    <pre>{{ notes }}</pre>
  </form>
</template>
