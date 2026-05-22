import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="email-input"
  type="email"
  id=""
  name=""
  value="">`;

const meta = {
  title: 'Headless/EmailInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
