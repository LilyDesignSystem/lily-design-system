import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GrailLayoutRightAside component -->\n<!--\n  Description: grail layout right aside sidebar\n  HTML tag: <aside>\n  CSS class: grail-layout-right-aside\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <aside class=\"grail-layout-right-aside\" aria-label=\"Example\">\n      ...\n    </aside>\n-->\n\n<aside\n  class=\"grail-layout-right-aside\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</aside>";

const meta = {
  title: 'Headless/Grail Layout Right Aside',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
