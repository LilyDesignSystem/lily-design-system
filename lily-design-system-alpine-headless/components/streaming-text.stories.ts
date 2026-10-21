import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"streaming-text\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\" aria-label=\"Assistant answer\" aria-busy=\"true\" data-streaming=\"true\">The answer is arriv</div>\n<div class=\"streaming-text\" id=\"streaming-text-done\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\" aria-label=\"Assistant answer\">The answer has arrived in full.</div>";

const meta = {
  title: 'Headless/Streaming Text',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
