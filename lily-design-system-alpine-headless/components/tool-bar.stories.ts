import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ToolBar component -->\n<!--\n  Description: a horizontal bar of tool actions\n  HTML tag: <div>\n  CSS class: tool-bar\n  Keyboard: None (passive element)\n  Accessibility: role=\"toolbar\", aria-label for accessible name\n  Usage:\n    <div class=\"tool-bar\" role=\"toolbar\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"tool-bar\"\n  role=\"toolbar\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Tool Bar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
