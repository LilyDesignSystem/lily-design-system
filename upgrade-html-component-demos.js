#!/usr/bin/env node
// Reads demo data from generate-component-demos.js output,
// injects a componentDemos object and updates renderComponent
// in component.html to show live demos.

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Generate demo data
const raw = execSync('node ' + path.join(__dirname, 'generate-component-demos.js'), { encoding: 'utf8' });

// Parse the TypeScript output into a plain JS object literal string
// Input lines look like:   'slug': '<html>...',
const demos = {};
const lineRe = /^\s+'([^']+)':\s+'(.*)',?\s*$/;
for (const line of raw.split('\n')) {
    const m = line.match(lineRe);
    if (m) {
        demos[m[1]] = m[2];
    }
}

// Build a JS object literal string for embedding
let demoLines = ['            var componentDemos = {'];
const slugs = Object.keys(demos);
for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const val = demos[slug];
    const comma = i < slugs.length - 1 ? ',' : '';
    demoLines.push("                '" + slug + "': '" + val + "'" + comma);
}
demoLines.push('            };');
const demoBlock = demoLines.join('\n');

// Read component.html
const htmlPath = path.join(__dirname, 'lily-design-system-html-css-js-examples', 'pages', 'components', 'component.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Insert componentDemos object right before the renderComponent function
const renderMarker = '                function renderComponent(component) {';
if (!html.includes(renderMarker)) {
    console.error('Could not find renderComponent function marker');
    process.exit(1);
}
html = html.replace(renderMarker, demoBlock + '\n\n' + renderMarker);

// Update renderComponent to include a Demo section
// Find the content.innerHTML assignment and add demo card after the back link
const oldContent = `                    content.innerHTML =
                        '<p><a href="index.html">Back to all components</a></p>' +
                        '<div class="card" role="region" aria-label="Component overview">`;

const newContent = `                    var demoHtml = componentDemos[component.slug] || '';

                    content.innerHTML =
                        '<p><a href="index.html">Back to all components</a></p>' +
                        '<div class="card" role="region" aria-label="Live demo">' +
                        '<h2>Demo</h2>' +
                        '<div style="padding: 1.5rem;">' +
                        demoHtml +
                        '</div>' +
                        '</div>' +
                        '<div class="card" role="region" aria-label="Component overview">`;

if (!html.includes(oldContent)) {
    console.error('Could not find content.innerHTML pattern to replace');
    process.exit(1);
}
html = html.replace(oldContent, newContent);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Updated component.html with ' + slugs.length + ' component demos.');
