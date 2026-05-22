import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="error-message">
  <span class="visually-hidden">Error:</span></span>`;

const meta = {
  title: 'Headless/ErrorMessage',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
