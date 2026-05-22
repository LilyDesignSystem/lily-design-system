import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="toggle-group"
  role="group"></div>`;

const meta = {
  title: 'Headless/ToggleGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
