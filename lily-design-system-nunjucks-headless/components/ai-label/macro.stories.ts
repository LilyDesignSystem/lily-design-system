import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="ai-label">AI</span>`;

const meta = {
  title: 'Headless/AiLabel',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
