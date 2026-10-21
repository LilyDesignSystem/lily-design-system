import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MockupWindow component -->\n<!--\n  Description: a box area that looks like a desktop window\n  HTML tag: <div>\n  CSS class: mockup-window\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"mockup-window\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Mockup Window',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
