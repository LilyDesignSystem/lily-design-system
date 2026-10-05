import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="empty-state"
  role="group"
  aria-label="No results"
>
  <h2>Nothing here yet</h2>
  <p>Try a different search.</p>
  <button type="button">Clear filters</button>
</div>`;

const meta = {
  title: 'Headless/EmptyState',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
