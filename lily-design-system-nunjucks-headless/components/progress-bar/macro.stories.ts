import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="progress-bar"
  role="progressbar"
  aria-valuenow=""
  aria-valuemin="0"
  aria-valuemax="100"></div>`;

const meta = {
  title: 'Headless/ProgressBar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
