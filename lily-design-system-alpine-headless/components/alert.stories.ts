import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Alert component -->\n<!--\n  Description: a status message for important information or feedback\n  HTML tag: <div>\n  CSS class: alert\n  Keyboard: None (passive element)\n  Accessibility: role=\"alert\", aria-label for accessible name\n  Usage:\n    <div class=\"alert\" role=\"alert\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"alert\"\n  role=\"alert\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Alert',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
