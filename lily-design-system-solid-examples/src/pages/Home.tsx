import type { JSX } from "@solidjs/web";
import { components } from "../data/components";

export default function Home(): JSX.Element {
    return (
        <main class="home-page">
            <h1>Lily Design System</h1>
            <p>Solid 2.0 examples with NHS UK design system styles.</p>
            <p>
                Every component of the catalog, {components.length} in all, has a page with a live
                demo, its markup and a usage example. The header's theme, language and text size
                pickers are the Solid helper packages.
            </p>
            <h2>Examples</h2>
            <ul>
                <li>
                    <a href="/components">
                        <strong>Components</strong>
                    </a>
                    <br />
                    <span>
                        The full catalog, searchable and filterable by category and suffix pattern
                    </span>
                </li>
            </ul>
        </main>
    );
}
