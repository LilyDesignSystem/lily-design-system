import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GrailLayoutLeftAside component -->\n<!--\n  Description: grail layout left aside sidebar\n  HTML tag: <aside>\n  CSS class: grail-layout-left-aside\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <aside class=\"grail-layout-left-aside\" aria-label=\"Example\">\n      ...\n    </aside>\n-->\n\n<aside\n  class=\"grail-layout-left-aside\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</aside>";

const meta = {
  title: 'Headless/Grail Layout Left Aside',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
