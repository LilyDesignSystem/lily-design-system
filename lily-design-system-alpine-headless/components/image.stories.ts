import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Image component -->\n<!--\n  Description: an image element with alt text\n  HTML tag: <img>\n  CSS class: image\n  Accessibility: aria-label for accessible name\n-->\n\n<img\n  class=\"image\"\n  aria-label=\"Example\"\n>\n  <!-- Consumer provides content -->\n</img>";

const meta = {
  title: 'Headless/Image',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
