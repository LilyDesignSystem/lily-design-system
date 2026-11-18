import type { JSX } from "@solidjs/web";
import { For, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { components } from "../data/components";
import { componentDemos } from "../data/component-demos";
import { componentExamples } from "../data/component-examples";
import NotFound from "./NotFound";

export default function Component(): JSX.Element {
    const params = useParams<{ slug: string }>();
    const component = () => components.find((c) => c.slug === params.slug);
    const demoHtml = () => componentDemos[params.slug];
    const example = () => componentExamples[params.slug];

    return (
        <Show
            when={component()}
            fallback={<NotFound />}
        >
            {(c) => (
                <main class="page-wrapper">
                    <p>
                        <a href="/components">&larr; Back to components</a>
                    </p>
                    <h1>{c().name}</h1>
                    <p>{c().description}</p>

                    <h2>Demo</h2>
                    <div class="card demo-card">
                        <Show
                            when={demoHtml()}
                            fallback={
                                <p>
                                    <em>No demo available.</em>
                                </p>
                            }
                        >
                            {(html) => <div innerHTML={html()} />}
                        </Show>
                    </div>

                    <Show when={demoHtml()}>
                        {(html) => (
                            <details>
                                <summary>Show demo markup</summary>
                                <pre tabindex={0}>
                                    <code>{html()}</code>
                                </pre>
                            </details>
                        )}
                    </Show>

                    <Show when={example()?.variants?.length}>
                        <h2>More examples</h2>
                        <For each={example()?.variants ?? []}>
                            {(variant) => (
                                <div>
                                    <h3>{variant.title}</h3>
                                    <div class="card demo-card">
                                        <div innerHTML={variant.html} />
                                    </div>
                                    <details>
                                        <summary>Show markup</summary>
                                        <pre tabindex={0}>
                                            <code>{variant.html}</code>
                                        </pre>
                                    </details>
                                </div>
                            )}
                        </For>
                    </Show>

                    <h2>Details</h2>
                    <dl>
                        <dt>Name</dt>
                        <dd>{c().name}</dd>
                        <dt>Slug</dt>
                        <dd>
                            <code>{c().slug}</code>
                        </dd>
                        <dt>Description</dt>
                        <dd>{c().description}</dd>
                    </dl>

                    <h2>Usage</h2>
                    <pre tabindex={0}>
                        <code>{example()?.usage ? example()!.usage!.code : `<${c().name} />`}</code>
                    </pre>

                    <h2>Import</h2>
                    <pre tabindex={0}>
                        <code>{`import { ${c().name} } from "@lilydesignsystem/solid-headless";`}</code>
                    </pre>
                </main>
            )}
        </Show>
    );
}
