import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<details class=\"thinking\" data-streaming=\"true\" aria-busy=\"true\">\n  <summary class=\"thinking-summary\">Thinking</summary>\n  <div class=\"thinking-content\">\n    <p>Reasoning content goes here.</p>\n  </div>\n</details>";

const meta = {
  title: 'Headless/Thinking',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
