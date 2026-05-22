import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="color-picker"
  role="radiogroup" aria-label="Colour"></div>`;

const meta = {
  title: 'Headless/ColorPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
