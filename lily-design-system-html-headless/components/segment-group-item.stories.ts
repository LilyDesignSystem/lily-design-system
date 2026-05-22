import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="segment-group-item"
  aria-label=""
>
  <!-- Consumer provides button content -->
</button>`;

const meta = {
  title: 'Headless/SegmentGroupItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
