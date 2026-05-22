import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="task-bar-button"
  type="button"></button>`;

const meta = {
  title: 'Headless/TaskBarButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
