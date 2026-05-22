import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="password-input"
  type="password"
  id=""
  name="">`;

const meta = {
  title: 'Headless/PasswordInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
