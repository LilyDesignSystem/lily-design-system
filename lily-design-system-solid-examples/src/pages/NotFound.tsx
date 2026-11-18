import type { JSX } from "@solidjs/web";

export default function NotFound(): JSX.Element {
    return (
        <main class="page-wrapper">
            <h1>Page not found</h1>
            <p>
                <a href="/">Go to the home page</a> or{" "}
                <a href="/components">browse the components</a>.
            </p>
        </main>
    );
}
