import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="color-input"
  type="color"
  id=""
  name=""
  value="#000000">`;

const meta = {
  title: 'Headless/ColorInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
