import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"medical-banner-box-for-danger\"\n  role=\"region\"\n  aria-label=\"\"\n  data-type=\"danger\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Medical Banner Box For Danger',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
