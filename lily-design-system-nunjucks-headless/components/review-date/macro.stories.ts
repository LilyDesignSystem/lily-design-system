import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<time class="review-date" aria-label="Last reviewed" datetime="2026-10-06">6 October 2026</time>`;

const meta = {
  title: 'Headless/ReviewDate',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
