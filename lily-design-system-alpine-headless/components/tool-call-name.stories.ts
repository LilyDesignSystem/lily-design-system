import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span class=\"tool-call-name\">search_web</span>";

const meta = {
  title: 'Headless/Tool Call Name',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
