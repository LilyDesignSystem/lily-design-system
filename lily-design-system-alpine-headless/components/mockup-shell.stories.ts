import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MockupShell component -->\n<!--\n  Description: a box area that looks like a terminal shell\n  HTML tag: <div>\n  CSS class: mockup-shell\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"mockup-shell\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Mockup Shell',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
