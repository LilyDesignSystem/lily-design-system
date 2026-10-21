import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span class=\"tool-call-status\" data-status=\"running\">Running</span>";

const meta = {
  title: 'Headless/Tool Call Status',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
