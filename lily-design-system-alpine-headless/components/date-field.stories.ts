import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DateField component -->\n<!--\n  Description: a structured field for entering date components\n  HTML tag: <div>\n  CSS class: date-field\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"date-field\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"date-field\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Date Field',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
