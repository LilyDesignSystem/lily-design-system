import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"banner-box\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Banner Box',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
