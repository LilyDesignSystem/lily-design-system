import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<section\n  class=\"government-identifier\"\n  aria-label=\"\"\n>\n  <div class=\"government-identifier-masthead\">\n    <!-- Optional logo:\n         <img class=\"government-identifier-logo\" src=\"\" alt=\"\"> -->\n    <p class=\"government-identifier-agency\">\n      <!-- When agencyHref is provided, wrap agencyName in <a href=\"…\">…</a>;\n           otherwise wrap in <span>…</span>. -->\n    </p>\n    <!-- Optional description:\n         <p class=\"government-identifier-description\"></p> -->\n  </div>\n\n  <nav\n    class=\"government-identifier-links\"\n    aria-label=\"\"\n  >\n    <!-- Consumer provides the required links list (typically a <ul> of <li><a></a></li>) -->\n  </nav>\n</section>";

const meta = {
  title: 'Headless/Government Identifier',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
