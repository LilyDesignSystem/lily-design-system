import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ToolCallOutput component -->\n<!--\n  Description: the output or result returned by a tool in a tool call.\n  HTML tag: <div>\n  CSS class: tool-call-output\n  Contract: `label` (optional) sets `role=\"group\"` and `aria-label`; without it neither is rendered\n-->\n\n<div class=\"tool-call-output\" role=\"group\" aria-label=\"Arguments\">{\"query\": \"weather\"}</div>";

const meta = {
  title: 'Headless/Tool Call Output',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
