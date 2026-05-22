import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="segment-group-item"
  type="button"
  role="radio"
  aria-checked="false"
  tabindex="-1"></button>`;

const meta = {
  title: 'Headless/SegmentGroupItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
