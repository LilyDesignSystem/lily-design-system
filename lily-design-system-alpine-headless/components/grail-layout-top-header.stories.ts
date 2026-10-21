import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GrailLayoutTopHeader component -->\n<!--\n  Description: grail layout top header full width\n  HTML tag: <header>\n  CSS class: grail-layout-top-header\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <header class=\"grail-layout-top-header\" aria-label=\"Example\">\n      ...\n    </header>\n-->\n\n<header\n  class=\"grail-layout-top-header\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</header>";

const meta = {
  title: 'Headless/Grail Layout Top Header',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
