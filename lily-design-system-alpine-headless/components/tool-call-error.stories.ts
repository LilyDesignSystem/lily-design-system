import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ToolCallError component -->\n<!--\n  Description: the error shown when a tool call fails.\n  HTML tag: <div>\n  CSS class: tool-call-error\n  Contract: `role=\"alert\"` announces the error when it appears (open the tool call on error so it is not hidden inside a closed `<details>`)\n-->\n\n<div class=\"tool-call-error\" role=\"alert\">The tool timed out.</div>";

const meta = {
  title: 'Headless/Tool Call Error',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
