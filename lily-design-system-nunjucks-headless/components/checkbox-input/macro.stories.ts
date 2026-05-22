import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="checkbox-input"
  type="checkbox"
  id="">`;

const meta = {
  title: 'Headless/CheckboxInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
