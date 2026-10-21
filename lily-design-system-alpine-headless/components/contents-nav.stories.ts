import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ContentsNav component -->\n<!--\n  Description: a navigation landmark for a list of contents\n  HTML tag: <nav>\n  CSS class: contents-nav\n  Keyboard: None (passive element)\n  Accessibility: Implicit navigation role, aria-label for accessible name\n  Usage:\n    <nav class=\"contents-nav\" aria-label=\"Example\">\n      ...\n    </nav>\n  Scrollspy (optional): mark the link of the section in view with\n    aria-current and data-active by calling startScrollspy(nav, { offset,\n    root, current, onChange }) from contents-nav-spy.js. The links are your\n    own <a href=\"#id\"> elements; see contents-nav-spy.js for the rules.\n-->\n\n<nav\n  class=\"contents-nav\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides navigation list -->\n</nav>";

const meta = {
  title: 'Headless/Contents Nav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
