import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span class="tool-call-name">search_web</span></div>`;

const meta = {
  title: 'Headless/ToolCallName',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
