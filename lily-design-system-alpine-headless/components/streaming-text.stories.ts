import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- StreamingText component -->\n<!--\n  Description: text that arrives in chunks, as an AI answer streams in, announced once to screen readers when complete.\n  HTML tag: <div role=\"status\">\n  CSS class: streaming-text\n  Keyboard: None\n  Accessibility: a polite, atomic status region. While streaming the region is\n    marked busy (aria-busy=\"true\", data-streaming=\"true\") so assistive technology\n    waits; remove both when the last chunk arrives and the finished text is\n    announced once. The component never splits, times or animates the text.\n  Usage (streaming):\n    <div class=\"streaming-text\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\" aria-label=\"Assistant answer\" aria-busy=\"true\" data-streaming=\"true\">The answer is arriv</div>\n-->\n\n<div class=\"streaming-text\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\" aria-label=\"Assistant answer\" aria-busy=\"true\" data-streaming=\"true\">The answer is arriv</div>\n<div class=\"streaming-text\" id=\"streaming-text-done\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\" aria-label=\"Assistant answer\">The answer has arrived in full.</div>";

const meta = {
  title: 'Headless/Streaming Text',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
