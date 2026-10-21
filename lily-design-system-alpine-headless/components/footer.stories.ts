import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Footer component -->\n<!--\n  Description: a page or section footer area\n  HTML tag: <footer>\n  CSS class: footer\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <footer class=\"footer\" aria-label=\"Example\">\n      ...\n    </footer>\n-->\n\n<footer\n  class=\"footer\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</footer>";

const meta = {
  title: 'Headless/Footer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
