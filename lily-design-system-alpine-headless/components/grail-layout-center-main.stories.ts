import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GrailLayoutCenterMain component -->\n<!--\n  Description: grail layout center main content\n  HTML tag: <main>\n  CSS class: grail-layout-center-main\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <main class=\"grail-layout-center-main\" aria-label=\"Example\">\n      ...\n    </main>\n-->\n\n<main\n  class=\"grail-layout-center-main\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</main>";

const meta = {
  title: 'Headless/Grail Layout Center Main',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
