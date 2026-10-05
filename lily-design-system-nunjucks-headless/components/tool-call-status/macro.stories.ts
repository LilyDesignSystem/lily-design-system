import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span class="tool-call-status" data-status="running">Running</span></div>`;

const meta = {
  title: 'Headless/ToolCallStatus',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
