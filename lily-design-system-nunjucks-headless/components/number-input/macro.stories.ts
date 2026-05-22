import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="number-input"
  type="number"
  id=""
  name=""
  value="">`;

const meta = {
  title: 'Headless/NumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
