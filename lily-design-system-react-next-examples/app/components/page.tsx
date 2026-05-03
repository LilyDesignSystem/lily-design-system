import Link from "next/link";
import { components } from "@/app/data/components";

export default function ComponentsPage() {
    return (
        <main className="page-wrapper">
            <h1>Components</h1>
            <p>407 headless components</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {components.map((c) => (
                    <li key={c.slug} style={{ borderBottom: "1px solid var(--nhs-color-border, #d8dde0)", padding: "var(--nhs-space-3) 0" }}>
                        <Link href={`/components/${c.slug}`} style={{ fontWeight: 700 }}>{c.name}</Link>
                        <span style={{ color: "var(--nhs-color-secondary, #4c6272)", marginLeft: "0.5rem" }}>{c.description}</span>
                    </li>
                ))}
            </ul>
        </main>
    );
}
