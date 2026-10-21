import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Header component -->\n<!--\n  Description: a page or section header area\n  HTML tag: <header>\n  CSS class: header\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <header class=\"header\" aria-label=\"Example\">\n      ...\n    </header>\n-->\n\n<header\n  class=\"header\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</header>";

const meta = {
  title: 'Headless/Header',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
