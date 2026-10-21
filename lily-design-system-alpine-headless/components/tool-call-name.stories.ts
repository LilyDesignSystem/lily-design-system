import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ToolCallName component -->\n<!--\n  Description: the name of the tool in a tool call, shown in the summary.\n  HTML tag: <span>\n  CSS class: tool-call-name\n  Contract: a plain wrapper with the base class and children\n-->\n\n<span class=\"tool-call-name\">search_web</span>";

const meta = {
  title: 'Headless/Tool Call Name',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
