import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ol
  class="task-list"></ol>`;

const meta = {
  title: 'Headless/TaskList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
