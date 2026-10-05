import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div class="tool-call-input" role="group" aria-label="Arguments">{"query": "weather"}</div></div>`;

const meta = {
  title: 'Headless/ToolCallInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
