import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="resizable"
  role="group"
  aria-label="Resizable region"
  data-module="resizable"></div>`;

const meta = {
  title: 'Headless/Resizable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
