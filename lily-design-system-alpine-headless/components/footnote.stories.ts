import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Footnote component -->\n<!--\n  Description: a footnote reference and content element\n  HTML tag: <aside>\n  CSS class: footnote\n  Keyboard: None (passive element)\n  Accessibility: role=\"note\" + aria-label; id used for in-page linking\n  Usage:\n    <aside class=\"footnote\" id=\"fn1\" role=\"note\" aria-label=\"Example\">\n      ...\n    </aside>\n-->\n\n<aside\n  class=\"footnote\"\n  id=\"\"\n  role=\"note\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides footnote content -->\n</aside>";

const meta = {
  title: 'Headless/Footnote',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
