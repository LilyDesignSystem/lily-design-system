import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"theme-provider\"\n  aria-label=\"\"\n  data-theme=\"light\"\n  style=\"display: contents;\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Theme Provider',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
