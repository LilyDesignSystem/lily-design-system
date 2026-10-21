import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Progress component -->\n<!--\n  Description: a horizontal progress bar showing completion\n  HTML tag: <progress>\n  CSS class: progress\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <progress class=\"progress\" aria-label=\"Example\">\n      ...\n    </progress>\n-->\n\n<progress\n  class=\"progress\"\n  aria-label=\"\"\n  max=\"100\"\n  value=\"0\"\n>\n  <!-- Consumer provides fallback text -->\n</progress>";

const meta = {
  title: 'Headless/Progress',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
