import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span class="middle-truncation" data-strategy="min-end" data-ellipsis="…" data-end="6"><span class="middle-truncation-visual" aria-hidden="true">quarterly-report-final-version-3.pdf</span><span class="middle-truncation-full">quarterly-report-final-version-3.pdf</span></span>`;

const meta = {
  title: 'Headless/MiddleTruncation',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
