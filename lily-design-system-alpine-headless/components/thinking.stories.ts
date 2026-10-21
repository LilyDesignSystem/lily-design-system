import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Thinking component -->\n<!--\n  Description: a collapsible block showing an AI agent's reasoning, closed by default\n  HTML tag: <details>\n  CSS class: thinking (root), thinking-summary, thinking-content\n  Keyboard: native summary (Tab to focus, Enter or Space to toggle)\n  Accessibility: the <summary> text is the label (consumer-supplied). While content is still\n    being produced set data-streaming=\"true\" and aria-busy=\"true\" on the root; remove both when\n    done. Add the open attribute to start expanded.\n  Usage:\n    <details class=\"thinking\">\n      <summary class=\"thinking-summary\">Thinking</summary>\n      <div class=\"thinking-content\">...</div>\n    </details>\n-->\n\n<details class=\"thinking\" data-streaming=\"true\" aria-busy=\"true\">\n  <summary class=\"thinking-summary\">Thinking</summary>\n  <div class=\"thinking-content\">\n    <p>Reasoning content goes here.</p>\n  </div>\n</details>";

const meta = {
  title: 'Headless/Thinking',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
