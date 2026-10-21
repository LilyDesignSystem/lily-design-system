import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ClampText component -->\n<!--\n  Description: a text container that truncates content to a maximum number of lines\n\n  HTML tag: <div>\n  CSS class: clamp-text\n  Keyboard: None (passive element)\n  Accessibility: aria-label optional; full text content remains in DOM for assistive technologies\n\n  Behavior:\n    Sets data-lines attribute and inline CSS custom property --clamp-text-lines\n    so consumer CSS can apply -webkit-line-clamp or modern line-clamp.\n    Component does NOT apply overflow: hidden — that is left to consumer styling.\n\n  Usage:\n    <div class=\"clamp-text\" data-lines=\"2\" style=\"--clamp-text-lines: 2;\" aria-label=\"Article preview\">\n      Long content that may overflow several lines...\n    </div>\n-->\n\n<div\n  class=\"clamp-text\"\n  data-lines=\"2\"\n  style=\"--clamp-text-lines: 2;\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content; full text remains in DOM and accessible to screen readers -->\n</div>";

const meta = {
  title: 'Headless/Clamp Text',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
