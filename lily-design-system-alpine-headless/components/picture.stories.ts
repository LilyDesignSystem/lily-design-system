import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<picture class=\"picture\">\n  <source srcset=\"wide.webp\" media=\"(min-width: 800px)\" type=\"image/webp\">\n  <img src=\"small.jpg\" alt=\"A lily in bloom\" width=\"320\" height=\"200\">\n</picture>";

const meta = {
  title: 'Headless/Picture',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
