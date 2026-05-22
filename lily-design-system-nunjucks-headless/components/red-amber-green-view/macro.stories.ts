import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="red-amber-green-view"
  data-status="unknown">
  <span class="red-amber-green-view-indicator" aria-hidden="true"></span>
  <span class="red-amber-green-view-text">Unknown</span>
</span>`;

const meta = {
  title: 'Headless/RedAmberGreenView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
