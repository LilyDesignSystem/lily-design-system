import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="island-kennitala-view"
  aria-label="Personal Identity Code">sample-value</span>`;

const meta = {
  title: 'Headless/IslandKennitalaView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
