import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ButtonGroup component -->\n<!--\n  Description: a wrapper that groups related buttons together\n\n  HTML tag: <div>\n  CSS class: button-group\n  Keyboard: None directly (focus moves through inner buttons via Tab)\n  Accessibility: role=\"group\" plus a required aria-label provides an accessible name for the group of related buttons.\n\n  Usage:\n    <div class=\"button-group\" role=\"group\" aria-label=\"Form actions\">\n      <button type=\"button\">Save</button>\n      <button type=\"button\">Cancel</button>\n    </div>\n-->\n\n<div\n  class=\"button-group\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides related <button> elements as children -->\n</div>";

const meta = {
  title: 'Headless/Button Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
