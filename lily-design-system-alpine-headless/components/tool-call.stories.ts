import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ToolCall component -->\n<!--\n  Description: a collapsible record of one tool invocation by an AI agent, with a name, a status word, and its input, output or error.\n  HTML tag: <details> with <summary class=\"tool-call-summary\"> and <div class=\"tool-call-content\">\n  CSS class: tool-call\n  Keyboard: Enter / Space on the native <summary> toggles\n  Accessibility: native details/summary; data-status carries the state and\n    aria-busy=\"true\" only while running; the status word is visible text,\n    never colour alone; ToolCallError is role=\"alert\" so open the call on error.\n-->\n\n<details class=\"tool-call\" data-status=\"running\" aria-busy=\"true\" open>\n  <summary class=\"tool-call-summary\"><span class=\"tool-call-name\">search_web</span> <span class=\"tool-call-status\" data-status=\"running\">Running</span></summary>\n  <div class=\"tool-call-content\">\n    <div class=\"tool-call-input\" role=\"group\" aria-label=\"Arguments\">{\"query\": \"weather\"}</div>\n  </div>\n</details>\n<details class=\"tool-call\" id=\"tool-call-error\" data-status=\"error\" open>\n  <summary class=\"tool-call-summary\"><span class=\"tool-call-name\">search_web</span> <span class=\"tool-call-status\" data-status=\"error\">Failed</span></summary>\n  <div class=\"tool-call-content\">\n    <div class=\"tool-call-error\" role=\"alert\">The tool timed out.</div>\n  </div>\n</details>";

const meta = {
  title: 'Headless/Tool Call',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
