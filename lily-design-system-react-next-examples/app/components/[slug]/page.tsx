import Link from "next/link";
import { components } from "@/app/data/components";
import { componentDemos } from "@/app/data/component-demos";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ComponentDetailPage({ params }: Props) {
    const { slug } = await params;
    const component = components.find((c) => c.slug === slug);
    if (!component) notFound();

    const demoHtml = componentDemos[slug];

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
            <pre><code>{`<${component.name} />`}</code></pre>
            <h2>Import</h2>
            <pre><code>{`import ${component.name} from "@lily/${component.name}";`}</code></pre>
        </main>
    );
}

export function generateStaticParams() {
    return components.map((c) => ({ slug: c.slug }));
}
