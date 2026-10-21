import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- IconList component -->\n<!--\n  Description: an ordered list of icon list item components\n\n  HTML tag: <ul>\n  CSS class: icon-list\n  Keyboard: None (passive list; inner focusable elements behave normally)\n  Accessibility: The native <ul> conveys list semantics. An optional aria-label provides an accessible name for the list.\n\n  Usage:\n    <ul class=\"icon-list\" aria-label=\"Benefits\">\n      <li class=\"icon-list-item\">…</li>\n      <li class=\"icon-list-item\">…</li>\n    </ul>\n-->\n\n<ul\n  class=\"icon-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides <li class=\"icon-list-item\"> children -->\n</ul>";

const meta = {
  title: 'Headless/Icon List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
