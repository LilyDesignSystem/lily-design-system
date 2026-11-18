import type { JSX } from "@solidjs/web";
import { SkipLink } from "@lilydesignsystem/solid-headless";
import { SiteHeader } from "./SiteHeader";
import { Router } from "./router";

/** The root layout: it stays mounted, and the matched page is its children. */
export default function App(): JSX.Element {
    return (
        <Router>
            {(props) => (
                <>
                    <SkipLink
                        href="#content"
                        label="Skip to main content"
                    />
                    <SiteHeader />
                    <div id="content">{props.children}</div>
                    <footer class="site-footer">
                        <p>Lily™ and Lily Design System™ are trademarks.</p>
                    </footer>
                </>
            )}
        </Router>
    );
}
