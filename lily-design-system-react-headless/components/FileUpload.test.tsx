import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./FileUpload";

function choose(input: HTMLInputElement, count: number) {
    const files = Array.from({ length: count }, (_, i) => new File(["x"], `f${i}.pdf`));
    Object.defineProperty(input, "files", {
        value: Object.assign(files, { item: (i: number) => files[i] ?? null }),
        configurable: true,
    });
    fireEvent.change(input);
}

describe("FileUpload", () => {
    test("renders upload button", () => {
        render(<Subject label="Upload" />);
        expect(screen.getByRole("button", { name: "Upload" })).toBeTruthy();
    });

    test("has hidden file input", () => {
        render(
            <Subject
                label="Upload"
                data-testid="fu"
            />,
        );
        const hidden = screen
            .getByTestId("fu")
            .querySelector("input[type='file']") as HTMLInputElement;
        expect(hidden).toBeTruthy();
        expect(hidden.hidden).toBe(true);
    });

    test("has live region for status", () => {
        render(
            <Subject
                label="Upload"
                data-testid="fu"
            />,
        );
        const live = screen.getByTestId("fu").querySelector("[aria-live='polite']");
        expect(live).toBeTruthy();
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Upload"
                disabled
            />,
        );
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Upload"
                data-testid="fu"
            />,
        );
        expect(screen.getByTestId("fu")).toBeTruthy();
    });

    test("announces the count in the consumer's words from selectedLabel", async () => {
        const fr = (n: number) => (n === 1 ? "1 fichier choisi" : `${n} fichiers choisis`);
        const { container } = render(
            <Subject
                label="Upload"
                selectedLabel={fr}
            />,
        );
        choose(container.querySelector('input[type="file"]') as HTMLInputElement, 2);
        expect(container.querySelector("[aria-live]")!.textContent!.trim()).toBe(
            "2 fichiers choisis",
        );
    });

    test("without selectedLabel the status stays empty: no English", async () => {
        const { container } = render(<Subject label="Upload" />);
        choose(container.querySelector('input[type="file"]') as HTMLInputElement, 1);
        const status = container.querySelector("[aria-live]")!;
        expect(status.getAttribute("data-file-count")).toBe("1");
        expect(status.textContent!.trim()).toBe("");
    });

    test("a drop zone takes dropped files into the same callback and count", () => {
        const onInputChange = vi.fn();
        const { container } = render(
            <Subject
                label="Upload"
                dropZone
                multiple
                onInputChange={onInputChange}
                selectedLabel={(n: number) => `${n} files`}
            />,
        );
        const root = container.querySelector(".file-upload") as HTMLElement;
        const file = new File(["x"], "scan.pdf", { type: "application/pdf" });
        const dataTransfer = { types: ["Files"], files: [file] as unknown as FileList };
        fireEvent.dragOver(root, { dataTransfer });
        expect(root.hasAttribute("data-drag-over")).toBe(true);
        fireEvent.drop(root, { dataTransfer });
        expect(root.hasAttribute("data-drag-over")).toBe(false);
        expect(onInputChange).toHaveBeenCalledWith(dataTransfer.files);
        expect(root.querySelector("[data-file-count]")?.textContent).toBe("1 files");
    });
});
