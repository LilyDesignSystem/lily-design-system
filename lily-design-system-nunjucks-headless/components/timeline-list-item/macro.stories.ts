import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="timeline-list-item">  <div class="timeline-list-item-body"></div>
</li>`;

const meta = {
  title: 'Headless/TimelineListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
