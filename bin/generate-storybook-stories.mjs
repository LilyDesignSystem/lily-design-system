#!/usr/bin/env node

// Generate Storybook story files for all Svelte components
// Usage: node bin/generate-storybook-stories.mjs

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

const PROJECTS = [
  {
    name: 'Headless',
    dir: 'lily-design-system-svelte-headless/components',
    storyPrefix: 'Headless',
  },
  {
    name: 'SvelteKit Examples',
    dir: 'lily-design-system-svelte-sveltekit-examples/src/lib/components',
    storyPrefix: 'Examples',
  },
];

const ROOT = new URL('..', import.meta.url).pathname;

function pascalToTitle(name) {
  return name.replace(/([A-Z])/g, ' $1').trim();
}

function analyzeComponent(filePath) {
  const src = readFileSync(filePath, 'utf-8');
  const hasChildren = /children\s*[:,]/.test(src) || /children\s*:\s*Snippet/.test(src) || /{@render children/.test(src);
  const hasLabel = /\blabel\b/.test(src) && /label\s*[:,]/.test(src);
  const hasHref = /\bhref\b/.test(src) && /href\s*[:,]/.test(src);
  const hasValue = /value\s*=\s*\$bindable/.test(src);
  const hasChecked = /checked\s*=\s*\$bindable/.test(src);
  const hasHeading = /heading\s*[:,]/.test(src) && /heading\??\s*:\s*string/.test(src);
  const hasTitle = /\btitle\s*[:,]/.test(src) && /title\??\s*:\s*string/.test(src);
  const hasCaption = /caption\s*[:,]/.test(src);
  const hasOpen = /\bopen\s*=\s*\$bindable/.test(src) || /\bopen\s*[:,]/.test(src);
  const hasType = /type\s*\??\s*:\s*"/.test(src);

  // Extract type options if present
  let typeOptions = [];
  const typeMatch = src.match(/type\??\s*:\s*((?:"[^"]+"\s*\|\s*)*"[^"]+")/);
  if (typeMatch) {
    typeOptions = typeMatch[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
  }

  // Detect required label (no default value)
  const labelRequired = /\blabel[,\s]/.test(src) && /label\??\s*:\s*string/.test(src);

  return {
    hasChildren,
    hasLabel,
    labelRequired,
    hasHref,
    hasValue,
    hasChecked,
    hasHeading,
    hasTitle,
    hasCaption,
    hasOpen,
    hasType,
    typeOptions,
  };
}

function generateStory(componentName, storyPrefix, props) {
  const title = `${storyPrefix}/${componentName}`;
  const lines = [];

  lines.push(`<script module lang="ts">`);
  lines.push(`  import { defineMeta } from '@storybook/addon-svelte-csf';`);
  lines.push(`  import ${componentName} from './${componentName}.svelte';`);
  lines.push(``);
  lines.push(`  const { Story } = defineMeta({`);
  lines.push(`    title: '${title}',`);
  lines.push(`    component: ${componentName},`);
  lines.push(`  });`);
  lines.push(`</script>`);
  lines.push(``);

  // Build args for the Default story
  const args = {};
  if (props.labelRequired || props.hasLabel) {
    args.label = pascalToTitle(componentName);
  }
  if (props.hasHref) {
    args.href = '#';
  }
  if (props.hasHeading) {
    args.heading = `${pascalToTitle(componentName)} Heading`;
  }
  if (props.hasCaption) {
    args.caption = `${pascalToTitle(componentName)} Caption`;
  }
  if (props.hasTitle) {
    args.title = pascalToTitle(componentName);
  }

  const hasArgs = Object.keys(args).length > 0;
  const argsLine = hasArgs
    ? `  args={${JSON.stringify(args).replace(/"/g, "'")}}`
    : '';

  if (props.hasChildren) {
    const childContent = getDefaultChildContent(componentName);
    lines.push(`<Story`);
    lines.push(`  name="Default"`);
    if (hasArgs) {
      lines.push(`  tags={['autodocs', '!dev']}`);
      lines.push(argsLine);
    } else {
      lines.push(`  tags={['autodocs', '!dev']}`);
    }
    lines.push(`>`);
    lines.push(`  ${childContent}`);
    lines.push(`</Story>`);
  } else {
    lines.push(`<Story`);
    lines.push(`  name="Default"`);
    if (hasArgs) {
      lines.push(`  tags={['autodocs', '!dev']}`);
      lines.push(argsLine);
    } else {
      lines.push(`  tags={['autodocs', '!dev']}`);
    }
    lines.push(`/>`);
  }

  lines.push(``);
  return lines.join('\n');
}

function getDefaultChildContent(name) {
  // Provide sensible default children content based on component name patterns
  const n = name.toLowerCase();

  if (n.includes('button')) return `<span>Click me</span>`;
  if (n.includes('badge')) return `<span>Badge</span>`;
  if (n.includes('tag') && !n.includes('input')) return `<span>Tag</span>`;
  if (n.includes('alert') && !n.includes('dialog')) return `<p>This is an alert message.</p>`;
  if (n.includes('callout')) return `<p>This is important information.</p>`;
  if (n.includes('card')) return `<p>Card content goes here.</p>`;
  if (n.includes('code') && n.includes('block')) return `<code>const x = 42;</code>`;
  if (n === 'code') return `<code>code</code>`;
  if (n.includes('kbd')) return `<kbd>Ctrl+S</kbd>`;
  if (n.includes('tooltip')) return `<span>Hover me</span>`;
  if (n.includes('dialog')) return `<p>Dialog content</p>`;
  if (n.includes('drawer') || n.includes('sheet') || n.includes('slideout')) return `<p>Panel content</p>`;
  if (n.includes('popover') || n.includes('popup') || n.includes('hover')) return `<p>Popover content</p>`;
  if (n.includes('accordion') && n.includes('item')) return `<p>Accordion item content</p>`;
  if (n.includes('list') && n.includes('item')) return `<span>List item</span>`;
  if (n.includes('menuitem') || (n.includes('menu') && n.includes('item'))) return `<span>Menu item</span>`;
  if (n.includes('breadcrumb') && n.includes('item')) return `<a href="#">Breadcrumb</a>`;
  if (n.includes('link')) return `<span>Link text</span>`;
  if (n.includes('tab') && n.includes('button')) return `<span>Tab</span>`;
  if (n.includes('bar') && n.includes('button')) return `<span>Action</span>`;
  if (n.includes('nav')) return `<ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>`;
  if (n.includes('list')) return `<li>Item 1</li><li>Item 2</li>`;
  if (n.includes('menu')) return `<ul><li>Option 1</li><li>Option 2</li></ul>`;
  if (n.includes('form')) return `<p>Form content</p>`;
  if (n.includes('header')) return `<h1>Header</h1>`;
  if (n.includes('footer')) return `<p>Footer content</p>`;
  if (n.includes('hero')) return `<p>Hero content</p>`;
  if (n.includes('banner')) return `<p>Banner message</p>`;
  if (n.includes('panel') || n.includes('floating')) return `<p>Panel content</p>`;
  if (n.includes('sidebar')) return `<nav>Sidebar content</nav>`;
  if (n.includes('notification') || n.includes('toast') || n.includes('sonner')) return `<p>Notification message</p>`;
  if (n.includes('table') && n.includes('data')) return `<span>Cell data</span>`;
  if (n.includes('table') && n.includes('col')) return `<span>Column header</span>`;
  if (n.includes('table') && n.includes('row')) return `<td>Row data</td>`;
  if (n.includes('table') && n.includes('head')) return `<tr><th>Header</th></tr>`;
  if (n.includes('table') && n.includes('body')) return `<tr><td>Data</td></tr>`;
  if (n.includes('table') && n.includes('foot')) return `<tr><td>Footer</td></tr>`;
  if (n.includes('table')) return `<thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody>`;
  if (n.includes('figure')) return `<img src="" alt="Figure" /><figcaption>Caption</figcaption>`;
  if (n.includes('fieldset')) return `<legend>Legend</legend><p>Fields</p>`;
  if (n.includes('field')) return `<input type="text" />`;
  if (n.includes('details') || n.includes('collapsible') || n.includes('expander')) return `<p>Expandable content</p>`;
  if (n.includes('carousel')) return `<div>Slide 1</div><div>Slide 2</div>`;
  if (n.includes('avatar') && n.includes('text')) return `<span>JD</span>`;
  if (n.includes('avatar') && n.includes('image')) return `<img src="" alt="Avatar" />`;
  if (n.includes('avatar') && n.includes('group')) return `<span>Avatar 1</span><span>Avatar 2</span>`;
  if (n.includes('avatar')) return `<span>Avatar</span>`;
  if (n.includes('skeleton')) return `<div style="width:200px;height:20px"></div>`;
  if (n.includes('icon')) return `<span>★</span>`;
  if (n.includes('image')) return `<img src="" alt="Image" />`;
  if (n.includes('emoji')) return `<span>😀</span>`;
  if (n.includes('flair')) return `<span>Flair</span>`;
  if (n.includes('loading') || n.includes('spinner') || n.includes('progress')) return `<span>Loading...</span>`;
  if (n.includes('label')) return `<span>Label text</span>`;
  if (n.includes('caption')) return `<span>Caption text</span>`;
  if (n.includes('hint')) return `<span>Hint text</span>`;
  if (n.includes('error')) return `<span>Error message</span>`;
  if (n.includes('separator')) return ``;
  if (n.includes('comment')) return `<p>User comment text</p>`;
  if (n.includes('chat') && n.includes('message')) return `<p>Hello, how are you?</p>`;
  if (n.includes('citation')) return `<span>Source citation</span>`;
  if (n.includes('footnote')) return `<span>Footnote text</span>`;
  if (n.includes('tile')) return `<p>Tile content</p>`;
  if (n.includes('segment')) return `<span>Segment</span>`;
  if (n.includes('toggle')) return `<span>Toggle</span>`;
  if (n.includes('mockup')) return `<p>Content inside mockup</p>`;
  if (n.includes('grail')) return `<p>Layout section content</p>`;
  if (n.includes('diff')) return `<p>Diff content</p>`;
  if (n.includes('tour')) return `<p>Tour content</p>`;
  if (n.includes('tree')) return `<ul><li>Branch 1</li><li>Branch 2</li></ul>`;
  if (n.includes('command')) return `<p>Search commands...</p>`;
  if (n.includes('picker') && !n.includes('button')) return `<p>Picker content</p>`;
  if (n.includes('select') && !n.includes('option')) return `<option value="1">Option 1</option><option value="2">Option 2</option>`;
  if (n.includes('option')) return `<span>Option text</span>`;
  if (n.includes('group')) return `<span>Group content</span>`;
  if (n.includes('view')) return `<span>View content</span>`;
  if (n.includes('scroll')) return `<p>Scrollable content area with enough text to scroll.</p>`;
  if (n.includes('resizable') || n.includes('splitter')) return `<div>Resizable content</div>`;
  if (n.includes('inset')) return `<p>Inset text content</p>`;
  if (n.includes('skip')) return `<span>Skip to main content</span>`;
  if (n.includes('screen')) return `<span>Screen reader text</span>`;
  if (n.includes('signature')) return `<p>Sign here</p>`;
  if (n.includes('sparkline')) return `<span>Sparkline data</span>`;
  if (n.includes('qr')) return `<span>QR data</span>`;

  // Generic fallback
  return `<p>${pascalToTitle(name)} content</p>`;
}

let totalCreated = 0;
let totalSkipped = 0;

for (const project of PROJECTS) {
  const componentsDir = join(ROOT, project.dir);

  if (!existsSync(componentsDir)) {
    console.log(`Skipping ${project.name}: directory not found at ${componentsDir}`);
    continue;
  }

  const files = readdirSync(componentsDir)
    .filter(f => f.endsWith('.svelte') && !f.endsWith('.stories.svelte'));

  console.log(`\n${project.name}: ${files.length} components`);

  for (const file of files) {
    const componentName = basename(file, '.svelte');
    const filePath = join(componentsDir, file);
    const storyPath = join(componentsDir, `${componentName}.stories.svelte`);

    if (existsSync(storyPath)) {
      totalSkipped++;
      continue;
    }

    const props = analyzeComponent(filePath);
    const storyContent = generateStory(componentName, project.storyPrefix, props);
    writeFileSync(storyPath, storyContent, 'utf-8');
    totalCreated++;
  }
}

console.log(`\nDone: ${totalCreated} stories created, ${totalSkipped} skipped (already exist)`);
