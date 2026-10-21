import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MockupLaptop component -->\n<!--\n  Description: a box area that looks like a laptop computer\n  HTML tag: <div>\n  CSS class: mockup-laptop\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"mockup-laptop\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Mockup Laptop',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
