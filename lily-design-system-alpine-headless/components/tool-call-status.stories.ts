import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ToolCallStatus component -->\n<!--\n  Description: the status of a tool call as a word, such as pending, running, done or error.\n  HTML tag: <span>\n  CSS class: tool-call-status\n  Contract: `status` (optional) sets `data-status`; the visible status word is the children (consumer text, never colour alone)\n-->\n\n<span class=\"tool-call-status\" data-status=\"running\">Running</span>";

const meta = {
  title: 'Headless/Tool Call Status',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
