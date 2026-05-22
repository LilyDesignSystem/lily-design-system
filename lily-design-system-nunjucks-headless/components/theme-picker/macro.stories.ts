import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="theme-picker"
  role="radiogroup" aria-label="Theme"></div>`;

const meta = {
  title: 'Headless/ThemePicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
