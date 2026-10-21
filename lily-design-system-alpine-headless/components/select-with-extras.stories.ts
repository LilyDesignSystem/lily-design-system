import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SelectWithExtras component -->\n<!--\n  Description: a select dropdown with additional features like search or groups\n  HTML tag: <div>\n  CSS class: select-with-extras\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"select-with-extras\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"select-with-extras\"\n  aria-label=\"\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Select With Extras',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
