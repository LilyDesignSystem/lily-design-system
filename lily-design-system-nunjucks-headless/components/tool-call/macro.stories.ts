import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<details class="tool-call" data-status="running" aria-busy="true"><summary class="tool-call-summary">search_web</summary><div class="tool-call-content">Body</div></details></div>`;

const meta = {
  title: 'Headless/ToolCall',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
