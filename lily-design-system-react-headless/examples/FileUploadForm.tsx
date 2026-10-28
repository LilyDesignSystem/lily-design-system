// Example: File upload form with progress feedback
//
// Demonstrates: FileUpload, Progress, Button, Alert, Badge, Form, Field

import { useState } from "react";
import FileUpload from "../components/FileUpload";
import Progress from "../components/Progress";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Badge from "../components/Badge";
import Form from "../components/Form";
import Field from "../components/Field";

interface UploadedFile {
    name: string;
    size: number;
}

export default function FileUploadForm() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);

    function handleFilesChange(fileList: FileList | null) {
        if (fileList) {
            const newFiles = Array.from(fileList).map((f) => ({
                name: f.name,
                size: f.size,
            }));
            setFiles((prev) => [...prev, ...newFiles]);
        }
    }

    function formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (files.length === 0) return;

        setUploading(true);
        setProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setUploading(false);
                    setDone(true);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    }

    function removeFile(index: number) {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    }

    return (
        <Form
            label="File upload"
            onSubmit={handleSubmit}
        >
            <h2>Upload Documents</h2>

            {done && (
                <Alert
                    type="success"
                    heading="Upload complete"
                >
                    {files.length} file(s) uploaded successfully.
                </Alert>
            )}

            <Field label="Select files">
                <FileUpload
                    label="Choose files to upload"
                    accept=".pdf,.doc,.docx,.txt"
                    multiple
                    onInputChange={handleFilesChange}
                    disabled={uploading}
                />
            </Field>

            {files.length > 0 && (
                <div>
                    <h3>Selected files</h3>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index}>
                                {file.name}
                                <Badge>{formatSize(file.size)}</Badge>
                                {!uploading && !done && (
                                    <Button onClick={() => removeFile(index)}>Remove</Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {uploading && (
                <Progress
                    label="Upload progress"
                    value={progress}
                    max={100}
                />
            )}

            <Button
                type="submit"
                disabled={files.length === 0 || uploading || done}
            >
                {uploading ? "Uploading..." : "Upload Files"}
            </Button>
        </Form>
    );
}
