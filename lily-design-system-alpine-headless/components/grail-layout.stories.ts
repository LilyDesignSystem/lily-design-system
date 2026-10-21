import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GrailLayout component -->\n<!--\n  Description: a responsive web design structure with header, left aside, center main, right aside, footer\n  HTML tag: <div>\n  CSS class: grail-layout\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"grail-layout\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"grail-layout\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Grail Layout',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
