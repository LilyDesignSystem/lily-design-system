import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<figure\n  class=\"feature-photo\"\n  aria-label=\"\"\n>\n  <img class=\"feature-photo-image\" src=\"\" alt=\"\" loading=\"lazy\">\n  <figcaption class=\"feature-photo-caption\">\n    <!-- Consumer provides caption + credit -->\n  </figcaption>\n</figure>";

const meta = {
  title: 'Headless/Feature Photo',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
