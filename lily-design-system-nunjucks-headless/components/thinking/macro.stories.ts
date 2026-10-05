import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<details class="thinking"><summary class="thinking-summary">Thinking</summary><div class="thinking-content">Step one, step two.</div></details>`;

const meta = {
  title: 'Headless/Thinking',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
