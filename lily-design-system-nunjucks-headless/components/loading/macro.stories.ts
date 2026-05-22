import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="loading"
  role="status" aria-live="polite"  aria-busy="true"></div>`;

const meta = {
  title: 'Headless/Loading',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
