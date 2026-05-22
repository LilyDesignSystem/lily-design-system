import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ol
  class="timeline-list"
  aria-label=""
>
  <!-- Consumer provides list items -->
</ol>`;

const meta = {
  title: 'Headless/TimelineList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
