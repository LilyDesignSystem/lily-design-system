import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div class="tool-call-error" role="alert">The tool timed out.</div></div>`;

const meta = {
  title: 'Headless/ToolCallError',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
