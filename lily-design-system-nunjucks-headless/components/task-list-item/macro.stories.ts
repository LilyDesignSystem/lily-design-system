import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="task-list-item"
  data-status="not-started">
  <span class="task-list-item-title"></span></li>`;

const meta = {
  title: 'Headless/TaskListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
