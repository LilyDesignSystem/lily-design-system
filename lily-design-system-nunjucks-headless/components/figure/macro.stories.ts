import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="figure"></figure>`;

const meta = {
  title: 'Headless/Figure',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
