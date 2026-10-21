import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"medical-banner-box\"\n  data-context=\"medical\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Medical Banner Box',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
