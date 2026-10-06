import Link from "next/link";
import { components } from "@/app/data/components";
import { componentDemos } from "@/app/data/component-demos";
import { componentExamples } from "@/app/data/component-examples";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ComponentDetailPage({ params }: Props) {
    const { slug } = await params;
    const component = components.find((c) => c.slug === slug);
    if (!component) notFound();

    const demoHtml = componentDemos[slug];
    const example = componentExamples[slug];

    return (
        <main className="page-wrapper">
            <p><Link href="/components">&larr; Back to components</Link></p>
            <h1>{component.name}</h1>
            <p>{component.description}</p>

            <h2>Demo</h2>
            <div className="card" style={{ padding: "1.5rem" }}>
                {demoHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: demoHtml }} />
                ) : (
                    <p><em>No demo available.</em></p>
                )}
            </div>

            {demoHtml && (
                <details>
                    <summary>Show demo markup</summary>
                    <pre tabIndex={0}><code>{demoHtml}</code></pre>
                </details>
            )}

            {example?.variants?.length ? (
                <>
                    <h2>More examples</h2>
                    {example.variants.map((variant) => (
                        <div key={variant.title}>
                            <h3>{variant.title}</h3>
                            <div className="card" style={{ padding: "1.5rem" }}>
                                <div dangerouslySetInnerHTML={{ __html: variant.html }} />
                            </div>
                            <details>
                                <summary>Show markup</summary>
                                <pre tabIndex={0}><code>{variant.html}</code></pre>
                            </details>
                        </div>
                    ))}
                </>
            ) : null}

            <h2>Details</h2>
            <dl>
                <dt>Name</dt>
                <dd>{component.name}</dd>
                <dt>Slug</dt>
                <dd><code>{component.slug}</code></dd>
                <dt>Description</dt>
                <dd>{component.description}</dd>
            </dl>
            <h2>Usage</h2>
            <pre tabIndex={0}><code>{example?.usage ? example.usage.code : `<${component.name} />`}</code></pre>
            <h2>Import</h2>
            <pre tabIndex={0}><code>{`import ${component.name} from "@lily/${component.name}";`}</code></pre>
        </main>
    );
}

export function generateStaticParams() {
    return components.map((c) => ({ slug: c.slug }));
}
