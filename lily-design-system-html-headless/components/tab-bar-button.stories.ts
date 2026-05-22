import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="tab-bar-button"
  role="tab"
  aria-label=""
  aria-selected="false"
  tabindex="-1"
>
  <!-- Consumer provides button content -->
</button>`;

const meta = {
  title: 'Headless/TabBarButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
