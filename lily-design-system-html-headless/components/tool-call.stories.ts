import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<details class="tool-call" data-status="running" aria-busy="true" open>
  <summary class="tool-call-summary"><span class="tool-call-name">search_web</span> <span class="tool-call-status" data-status="running">Running</span></summary>
  <div class="tool-call-content">
    <div class="tool-call-input" role="group" aria-label="Arguments">{"query": "weather"}</div>
  </div>
</details>
<details class="tool-call" id="tool-call-error" data-status="error" open>
  <summary class="tool-call-summary"><span class="tool-call-name">search_web</span> <span class="tool-call-status" data-status="error">Failed</span></summary>
  <div class="tool-call-content">
    <div class="tool-call-error" role="alert">The tool timed out.</div>
  </div>
</details>`;

const meta = {
  title: 'Headless/ToolCall',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
