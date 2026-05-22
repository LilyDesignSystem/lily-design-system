import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="task-bar"
  role="toolbar"
  aria-orientation="horizontal" aria-label="Task bar"></div>`;

const meta = {
  title: 'Headless/TaskBar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
