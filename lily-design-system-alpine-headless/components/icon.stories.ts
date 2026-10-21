import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Icon component -->\n<!--\n  Description: a container for displaying an icon\n  HTML tag: <span>\n  CSS class: icon\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"icon\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"icon\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Icon',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
