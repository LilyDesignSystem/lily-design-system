import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Visible component -->\n<!--\n  Description: an IntersectionObserver wrapper\n  HTML tag: <div>\n  CSS class: visible\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"visible\"\n  aria-label=\"\"\n  data-visible=\"false\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Visible',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
