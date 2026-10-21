import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Tag component -->\n<!--\n  Description: a keyword label for categorizing content\n  HTML tag: <span>\n  CSS class: tag\n  Keyboard: None (passive element)\n  Accessibility: not a live region by default. aria-label is not allowed\n    on a plain <span>, so extra context for screen readers is text appended\n    after the content (class screen-reader-span, which the themes hide); the\n    content stays exposed, since it may hold a control such as a remove\n    button. For a tag whose text changes in place, make it a live region\n    instead: role=\"status\" with aria-label.\n  Usage:\n    <span class=\"tag\">High<span class=\"screen-reader-span\"> priority</span></span>\n    <span class=\"tag\" role=\"status\" aria-label=\"Build: Passing\">Passing</span>\n-->\n\n<span class=\"tag\">\n  <!-- Consumer provides text content -->\n  <span class=\"screen-reader-span\"><!-- Optional context for screen readers --></span>\n</span>";

const meta = {
  title: 'Headless/Tag',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
