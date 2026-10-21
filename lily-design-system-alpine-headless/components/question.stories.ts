import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Question component -->\n<!--\n  Description: a question is anything that asks for information, invites a response, tests knowledge, etc.\n  HTML tag: <div>\n  CSS class: question\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"question\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Question',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
