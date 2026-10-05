import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div class="streaming-text" role="status" aria-live="polite" aria-atomic="true" aria-label="Assistant answer" aria-busy="true" data-streaming="true">The answer is arriv</div>`;

const meta = {
  title: 'Headless/StreamingText',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
