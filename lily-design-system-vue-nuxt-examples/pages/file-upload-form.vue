<script setup lang="ts">
import { ref } from "vue";

interface UploadedFile {
    name: string;
    size: number;
}

const files = ref<UploadedFile[]>([]);
const uploading = ref(false);
const progress = ref(0);
const done = ref(false);

function handleFilesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        const newFiles = Array.from(input.files).map((f) => ({
            name: f.name,
            size: f.size,
        }));
        files.value = [...files.value, ...newFiles];
    }
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function removeFile(index: number) {
    files.value = files.value.filter((_, i) => i !== index);
}

function handleSubmit() {
    if (files.value.length === 0) return;
    uploading.value = true;
    progress.value = 0;

    const interval = setInterval(() => {
        progress.value += 10;
        if (progress.value >= 100) {
            clearInterval(interval);
            uploading.value = false;
            done.value = true;
        }
    }, 300);
}
</script>

<template>
    <main class="page-wrapper">
        <Form
            label="File upload"
            @submit="handleSubmit"
        >
            <h1>Upload Documents</h1>

            <Alert
                v-if="done"
                type="success"
                heading="Upload complete"
            >
                {{ files.length }} file(s) uploaded successfully.
            </Alert>

            <Field label="Select files">
                <FileUpload label="Choose files to upload">
                    <FileInput
                        label="Choose files"
                        accept=".pdf,.doc,.docx,.txt"
                        :disabled="uploading"
                        @change="handleFilesChange"
                    />
                </FileUpload>
            </Field>

            <div v-if="files.length > 0">
                <h2>Selected files</h2>
                <ul>
                    <li
                        v-for="(file, index) in files"
                        :key="index"
                    >
                        {{ file.name }}
                        <Badge>{{ formatSize(file.size) }}</Badge>
                        <Button
                            v-if="!uploading && !done"
                            @click="removeFile(index)"
                        >
                            Remove
                        </Button>
                    </li>
                </ul>
            </div>

            <Progress
                v-if="uploading"
                label="Upload progress"
                :value="progress"
                :max="100"
            />

            <Button
                type="submit"
                :disabled="files.length === 0 || uploading || done"
            >
                {{ uploading ? "Uploading..." : "Upload Files" }}
            </Button>
        </Form>
    </main>
</template>
