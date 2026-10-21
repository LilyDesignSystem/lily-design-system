import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<button class=\"float-button\" type=\"button\" aria-label=\"\" data-position=\"bottom-right\"\n        style=\"position: fixed; bottom: 1rem; right: 1rem;\">\n  <!-- Consumer provides icon content (SVG, emoji, or glyph) -->\n</button>";

const meta = {
  title: 'Headless/Float Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
