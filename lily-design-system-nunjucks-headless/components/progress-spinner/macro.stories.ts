import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="progress-spinner"
  role="status"
  aria-live="polite"
  aria-busy="true"
  aria-label="Loading"></div>`;

const meta = {
  title: 'Headless/ProgressSpinner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
