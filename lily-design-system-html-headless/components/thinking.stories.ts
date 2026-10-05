import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<details class="thinking" data-streaming="true" aria-busy="true">
  <summary class="thinking-summary">Thinking</summary>
  <div class="thinking-content">
    <p>Reasoning content goes here.</p>
  </div>
</details>`;

const meta = {
  title: 'Headless/Thinking',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
