import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GrailLayoutBottomFooter component -->\n<!--\n  Description: grail layout bottom footer full width\n  HTML tag: <footer>\n  CSS class: grail-layout-bottom-footer\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <footer class=\"grail-layout-bottom-footer\" aria-label=\"Example\">\n      ...\n    </footer>\n-->\n\n<footer\n  class=\"grail-layout-bottom-footer\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</footer>";

const meta = {
  title: 'Headless/Grail Layout Bottom Footer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
