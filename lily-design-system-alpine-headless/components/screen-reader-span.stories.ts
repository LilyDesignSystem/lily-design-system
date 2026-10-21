import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ScreenReaderSpan component -->\n<!--\n  Description: a visually hidden span of text\n  HTML tag: <span>\n  CSS class: screen-reader-span\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<span\n  class=\"screen-reader-span\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</span>";

const meta = {
  title: 'Headless/Screen Reader Span',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
