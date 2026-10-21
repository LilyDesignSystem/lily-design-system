import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Skeleton component -->\n<!--\n  Description: a placeholder loading animation for content\n  HTML tag: <div>\n  CSS class: skeleton\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"skeleton\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"skeleton\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Skeleton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
