import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DialGroup component -->\n<!--\n  Description: a group of dial components\n  HTML tag: <div>\n  CSS class: dial-group\n  Keyboard: None (passive element)\n  Accessibility: role=\"group\", aria-label for accessible name\n-->\n\n<div\n  class=\"dial-group\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Dial Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
