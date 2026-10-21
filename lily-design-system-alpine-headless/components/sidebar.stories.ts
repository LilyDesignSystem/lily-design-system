import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Sidebar component -->\n<!--\n  Description: a side panel for navigation or supplementary content\n  HTML tag: <aside>\n  CSS class: sidebar\n  Keyboard: None (passive element)\n  Accessibility: role=\"complementary\", aria-label for accessible name\n  Usage:\n    <aside class=\"sidebar\" role=\"complementary\" aria-label=\"Example\">\n      ...\n    </aside>\n-->\n\n<aside\n  class=\"sidebar\"\n  role=\"complementary\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</aside>";

const meta = {
  title: 'Headless/Sidebar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
