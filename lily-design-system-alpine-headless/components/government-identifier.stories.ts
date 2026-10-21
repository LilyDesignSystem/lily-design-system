import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GovernmentIdentifier component -->\n<!--\n  Description: an identifier section with a parent agency logo, agency name, and required government links\n\n  HTML tag: <section>\n  CSS class: government-identifier\n  Keyboard: None directly (inner links are focusable as usual)\n  Accessibility:\n    - <section> with a required aria-label provides a region landmark for the identifier\n    - Inner <nav> with aria-label exposes the required-links group as a navigation landmark\n\n  Usage:\n    <section class=\"government-identifier\" aria-label=\"Agency identifier\">\n      <div class=\"government-identifier-masthead\">\n        <img class=\"government-identifier-logo\" src=\"…\" alt=\"Agency seal\">\n        <p class=\"government-identifier-agency\">\n          <a href=\"https://example.gov\">Example Agency</a>\n        </p>\n        <p class=\"government-identifier-description\">Description.</p>\n      </div>\n      <nav class=\"government-identifier-links\" aria-label=\"Agency identifier\">\n        <ul>\n          <li><a href=\"…\">About</a></li>\n          <li><a href=\"…\">Accessibility</a></li>\n          <li><a href=\"…\">FOIA requests</a></li>\n        </ul>\n      </nav>\n    </section>\n-->\n\n<section\n  class=\"government-identifier\"\n  aria-label=\"\"\n>\n  <div class=\"government-identifier-masthead\">\n    <!-- Optional logo:\n         <img class=\"government-identifier-logo\" src=\"\" alt=\"\"> -->\n    <p class=\"government-identifier-agency\">\n      <!-- When agencyHref is provided, wrap agencyName in <a href=\"…\">…</a>;\n           otherwise wrap in <span>…</span>. -->\n    </p>\n    <!-- Optional description:\n         <p class=\"government-identifier-description\"></p> -->\n  </div>\n\n  <nav\n    class=\"government-identifier-links\"\n    aria-label=\"\"\n  >\n    <!-- Consumer provides the required links list (typically a <ul> of <li><a></a></li>) -->\n  </nav>\n</section>";

const meta = {
  title: 'Headless/Government Identifier',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
