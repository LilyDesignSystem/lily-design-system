import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ErrorSummary component -->\n<!--\n  Description: a summary of all validation errors on a form\n  HTML tag: <div>\n  CSS class: error-summary\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"error-summary\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"error-summary\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Error Summary',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
