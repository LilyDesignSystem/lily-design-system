import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"grid\"\n  data-columns=\"12\"\n  style=\"display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 1rem;\"\n>\n  <!-- Consumer provides grid items -->\n</div>";

const meta = {
  title: 'Headless/Grid',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
