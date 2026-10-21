import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<details class=\"tool-call\" data-status=\"running\" aria-busy=\"true\" open>\n  <summary class=\"tool-call-summary\"><span class=\"tool-call-name\">search_web</span> <span class=\"tool-call-status\" data-status=\"running\">Running</span></summary>\n  <div class=\"tool-call-content\">\n    <div class=\"tool-call-input\" role=\"group\" aria-label=\"Arguments\">{\"query\": \"weather\"}</div>\n  </div>\n</details>\n<details class=\"tool-call\" id=\"tool-call-error\" data-status=\"error\" open>\n  <summary class=\"tool-call-summary\"><span class=\"tool-call-name\">search_web</span> <span class=\"tool-call-status\" data-status=\"error\">Failed</span></summary>\n  <div class=\"tool-call-content\">\n    <div class=\"tool-call-error\" role=\"alert\">The tool timed out.</div>\n  </div>\n</details>";

const meta = {
  title: 'Headless/Tool Call',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
