import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="red-orange-yellow-green-blue-view"
  data-status="unknown">
  <span class="red-orange-yellow-green-blue-view-indicator" aria-hidden="true"></span>
  <span class="red-orange-yellow-green-blue-view-text">Unknown</span>
</span>`;

const meta = {
  title: 'Headless/RedOrangeYellowGreenBlueView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
