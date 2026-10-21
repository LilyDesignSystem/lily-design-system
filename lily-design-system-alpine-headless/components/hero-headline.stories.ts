import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"hero-headline\"\n  aria-label=\"\"\n>\n  <div class=\"hero-headline-media\">\n    <!-- Consumer provides background media -->\n  </div>\n  <div class=\"hero-headline-content\">\n    <!-- Consumer provides headline content -->\n  </div>\n</div>";

const meta = {
  title: 'Headless/Hero Headline',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
