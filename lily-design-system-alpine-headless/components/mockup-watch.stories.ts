import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MockupWatch component -->\n<!--\n  Description: a box area that looks like a smart watch\n  HTML tag: <div>\n  CSS class: mockup-watch\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"mockup-watch\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Mockup Watch',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
