import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ErrorMessage component -->\n<!--\n  Description: an error message associated with a form field\n  HTML tag: <span>\n  CSS class: error-message\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"error-message\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"error-message\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Error Message',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
