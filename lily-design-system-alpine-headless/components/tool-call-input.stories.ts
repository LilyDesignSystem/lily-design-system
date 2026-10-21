import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ToolCallInput component -->\n<!--\n  Description: the input or arguments passed to a tool in a tool call.\n  HTML tag: <div>\n  CSS class: tool-call-input\n  Contract: `label` (optional) sets `role=\"group\"` and `aria-label`; without it neither is rendered\n-->\n\n<div class=\"tool-call-input\" role=\"group\" aria-label=\"Arguments\">{\"query\": \"weather\"}</div>";

const meta = {
  title: 'Headless/Tool Call Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
