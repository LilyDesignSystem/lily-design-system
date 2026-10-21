import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"container\">\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Container',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
