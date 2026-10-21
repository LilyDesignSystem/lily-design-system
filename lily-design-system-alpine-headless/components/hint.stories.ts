import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Hint component -->\n<!--\n  Description: hint text providing guidance for a form field\n  HTML tag: <span>\n  CSS class: hint\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"hint\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"hint\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Hint',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
