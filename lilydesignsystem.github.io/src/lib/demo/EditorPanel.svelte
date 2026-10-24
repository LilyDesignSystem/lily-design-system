<script lang="ts">
  import MarkdownEditor from './vendor/MarkdownEditor.svelte';
  import OrgEditor from './vendor/OrgEditor.svelte';
  import { addDays, type DemoStrings } from './strings.js';

  let { s, kind, today }: { s: DemoStrings; kind: 'markdown-editor' | 'org-editor'; today: string } = $props();

  // The edited text is the demo's state, not the language's: switching language keeps what you typed, and only
  // starts from the sample the first time. (Each editor remembers its own text.)
  let markdown = $state<string | null>(null);
  let org = $state<string | null>(null);
  const markdownText = $derived(markdown ?? s.editor.markdownSample);
  // The planning line belongs directly under the first heading.
  const orgText = $derived.by(() => {
    if (org !== null) return org;
    const [first, ...rest] = s.editor.orgSample.split('\n');
    return [first, `SCHEDULED: <${addDays(today, 3)}>`, ...rest].join('\n');
  });
  const MARKDOWN_TOOLS = ['heading', 'bold', 'italic', 'strikethrough', 'code', 'link', 'quote', 'bulletList', 'numberedList'];
  const ORG_TOOLS = ['todo', 'priority', 'scheduled', 'deadline', 'property', 'drawer', 'contact', 'bold', 'italic', 'link'];
  const pick = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, s.editor.tools[id]]));
</script>

{#if kind === 'markdown-editor'}
  <MarkdownEditor
    value={markdownText}
    onchange={(v: string) => (markdown = v)}
    label={s.editor.label}
    toolbarLabel={s.editor.toolbarLabel}
    labels={pick(MARKDOWN_TOOLS)}
    tools={MARKDOWN_TOOLS as never}
    rows={10}
    name="demo-markdown"
  />
{:else}
  <OrgEditor
    value={orgText}
    onchange={(v: string) => (org = v)}
    label={s.editor.label}
    toolbarLabel={s.editor.toolbarLabel}
    labels={pick(ORG_TOOLS)}
    tools={ORG_TOOLS as never}
    {today}
    rows={10}
    name="demo-org"
  />
{/if}
