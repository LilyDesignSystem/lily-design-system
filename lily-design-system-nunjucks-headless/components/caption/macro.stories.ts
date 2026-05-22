import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figcaption
  class="caption"></figcaption>`;

const meta = {
  title: 'Headless/Caption',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
