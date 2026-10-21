import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"masonry\"\n  data-columns=\"3\"\n  style=\"column-count: 3; column-gap: 1rem;\"\n>\n  <!-- Consumer provides masonry items; each item should have break-inside: avoid -->\n</div>";

const meta = {
  title: 'Headless/Masonry',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
