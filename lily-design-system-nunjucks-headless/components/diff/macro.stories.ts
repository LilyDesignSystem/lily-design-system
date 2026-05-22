import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="diff"
  role="group"
  aria-label="Diff">
  <div class="diff-left" aria-label="Before">
    
  </div>
  <div class="diff-right" aria-label="After">
    
  </div>
</div>`;

const meta = {
  title: 'Headless/Diff',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
