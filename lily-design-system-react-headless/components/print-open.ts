/**
 * Print opens closed disclosures (spec/testing, P42-T9). A printed page cannot open a closed `<details>`, so clinical text inside one
 * is lost on paper. On `beforeprint` every closed `<details>` the caller names is opened; on `afterprint` exactly the ones this
 * opened are closed again, so a disclosure the reader had opened stays open and the page is as it was.
 *
 * Browser-only: call it from a mount or effect hook, never during server rendering, and call the function it returns on unmount.
 */

/** Open `targets()` for print and close them again afterwards. Returns a function that stops listening (and restores). */
export function keepOpenForPrint(
    targets: () => Iterable<HTMLDetailsElement>,
    win: Pick<Window, "addEventListener" | "removeEventListener"> = window,
): () => void {
    let reopened: HTMLDetailsElement[] = [];

    const before = () => {
        // A second beforeprint with no afterprint in between must not forget what the first one opened.
        for (const details of targets()) {
            if (!details.open) {
                details.open = true;
                reopened.push(details);
            }
        }
    };
    const after = () => {
        for (const details of reopened) details.open = false;
        reopened = [];
    };

    win.addEventListener("beforeprint", before);
    win.addEventListener("afterprint", after);
    return () => {
        win.removeEventListener("beforeprint", before);
        win.removeEventListener("afterprint", after);
        after();
    };
}

/**
 * The page-level form: open every `<details>` under `root` for print. Call once from the root of a page (a layout's mount hook);
 * it covers disclosures a library does not own, such as a consumer's own.
 */
export function keepAllOpenForPrint(root: ParentNode = document): () => void {
    return keepOpenForPrint(() => root.querySelectorAll("details"));
}
