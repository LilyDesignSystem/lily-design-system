import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Hero component -->\n<!--\n  Description: a large box or image with a title and description\n  HTML tag: <section>\n  CSS class: hero\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<section\n  class=\"hero\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</section>";

const meta = {
  title: 'Headless/Hero',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
