import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="success-panel"></div>`;

const meta = {
  title: 'Headless/SuccessPanel',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
