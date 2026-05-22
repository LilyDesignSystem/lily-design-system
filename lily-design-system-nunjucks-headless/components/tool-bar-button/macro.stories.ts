import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="tool-bar-button"
  type="button"></button>`;

const meta = {
  title: 'Headless/ToolBarButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
