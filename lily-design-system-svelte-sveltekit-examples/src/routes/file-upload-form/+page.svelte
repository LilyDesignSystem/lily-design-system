<script lang="ts">
    import Form from "$lib/components/Form/Form.svelte";
    import Field from "$lib/components/Field/Field.svelte";
    import FileInput from "$lib/components/FileInput/FileInput.svelte";
    import FileUpload from "$lib/components/FileUpload/FileUpload.svelte";
    import ImageFileInput from "$lib/components/ImageFileInput/ImageFileInput.svelte";
    import Progress from "$lib/components/Progress/Progress.svelte";
    import Badge from "$lib/components/Badge/Badge.svelte";
    import Button from "$lib/components/Button/Button.svelte";
    import ErrorMessage from "$lib/components/ErrorMessage/ErrorMessage.svelte";
    import Hint from "$lib/components/Hint/Hint.svelte";
    import Label from "$lib/components/Label/Label.svelte";
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer/Footer.svelte";
    import BackLink from "$lib/components/BackLink/BackLink.svelte";

    let uploadedFiles: string[] = $state([]);
    let uploadProgress = $state(0);
    let uploading = $state(false);
    let error = $state("");

    function handleFileChange(files: FileList | null) {
        if (!files) return;
        error = "";
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 10 * 1024 * 1024) {
                error = `File "${file.name}" exceeds the 10MB limit.`;
                return;
            }
            uploadedFiles = [...uploadedFiles, file.name];
        }
        simulateUpload();
    }

    function simulateUpload() {
        uploading = true;
        uploadProgress = 0;
        const interval = setInterval(() => {
            uploadProgress += 10;
            if (uploadProgress >= 100) {
                clearInterval(interval);
                uploading = false;
            }
        }, 200);
    }

    function removeFile(index: number) {
        uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
    }

    function handleSubmit() {
        if (uploadedFiles.length === 0) {
            error = "Please select at least one file to upload.";
            return;
        }
        alert("Files submitted: " + uploadedFiles.join(", "));
    }
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>File Upload Form</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <Form label="File upload form" onsubmit={handleSubmit}>
        <h2>Upload Documents</h2>

        <Field label="Select a file">
            <Hint
                >Accepted formats: PDF, DOC, DOCX, JPG, PNG. Maximum 10MB.</Hint
            >
            <FileInput
                label="Choose a document"
                accept=".pdf,.doc,.docx,.jpg,.png"
            />
        </Field>

        <Field label="Drag and drop files">
            <Hint>Drop files here or click to browse</Hint>
            <FileUpload
                label="Drop files here"
                accept=".pdf,.doc,.docx"
                multiple
                onchange={handleFileChange}
            />
        </Field>

        <Field label="Upload a photo">
            <Hint>Select an image file for your profile</Hint>
            <ImageFileInput label="Choose a photo" accept="image/*" />
        </Field>

        {#if error}
            <ErrorMessage>{error}</ErrorMessage>
        {/if}

        {#if uploading}
            <div style="margin-bottom: var(--nhs-space-4);">
                <Label>Upload progress</Label>
                <Progress
                    label="Upload progress"
                    value={uploadProgress}
                    max={100}
                />
                <p>{uploadProgress}% complete</p>
            </div>
        {/if}

        {#if uploadedFiles.length > 0}
            <h3>Uploaded Files</h3>
            <ul
                style="list-style: none; padding: 0; margin-bottom: var(--nhs-space-4);"
            >
                {#each uploadedFiles as file, i}
                    <li
                        style="display: flex; align-items: center; gap: var(--nhs-space-2); padding: var(--nhs-space-2) 0; border-bottom: 1px solid var(--nhs-pale-grey);"
                    >
                        <Badge type="success">Uploaded</Badge>
                        <span>{file}</span>
                        <Button onclick={() => removeFile(i)}>Remove</Button>
                    </li>
                {/each}
            </ul>
        {/if}

        <Button type="submit">Submit Files</Button>
    </Form>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — File Upload Form Example</p>
    </div>
</Footer>
