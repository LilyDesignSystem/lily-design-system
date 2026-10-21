import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Banner component -->\n<!--\n  Description: a prominent message bar across the top of a page\n  HTML tag: <div>\n  CSS class: banner\n  Keyboard: None (passive element)\n  Accessibility: role=\"banner\", aria-label for accessible name\n  Usage:\n    <div class=\"banner\" role=\"banner\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"banner\"\n  role=\"banner\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Banner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
