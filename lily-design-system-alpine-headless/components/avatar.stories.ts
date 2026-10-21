import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Avatar component -->\n<!--\n  Description: an avatar indicator that shows an avatar image or avatar text\n  HTML tag: <div>\n  CSS class: avatar\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"avatar\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"avatar\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Avatar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
