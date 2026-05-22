import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="progress-circle"
  role="progressbar"
  aria-valuemin="0"
  aria-valuemax="100"></div>`;

const meta = {
  title: 'Headless/ProgressCircle',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
