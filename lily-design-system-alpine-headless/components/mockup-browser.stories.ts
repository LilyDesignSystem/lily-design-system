import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MockupBrowser component -->\n<!--\n  Description: a box area that looks like a web browser\n  HTML tag: <div>\n  CSS class: mockup-browser\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"mockup-browser\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Mockup Browser',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
