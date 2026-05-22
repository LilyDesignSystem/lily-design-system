import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="icon"></span>`;

const meta = {
  title: 'Headless/Icon',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
