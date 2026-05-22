import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="hidden-input"
  type="hidden"  name=""
  value="">`;

const meta = {
  title: 'Headless/HiddenInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
