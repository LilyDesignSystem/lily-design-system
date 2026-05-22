import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button class="action-bar-clear" type="button" aria-label="Clear selection">×</button>
    </div>
-->

<div
  class="action-bar"
  role="toolbar"
  aria-label=""
  data-selected-count="0"
>
  <span class="action-bar-count"></span>
  <!-- Consumer inserts action-bar-button children here -->
  <button class="action-bar-clear" type="button" aria-label="">×</button>
</div>`;

const meta = {
  title: 'Headless/ActionBar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
