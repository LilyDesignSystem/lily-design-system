import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Field component -->\n<!--\n  Description: a form field wrapper with label, input, and error message\n  HTML tag: <div>\n  CSS class: field\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"field\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"field\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Field',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
