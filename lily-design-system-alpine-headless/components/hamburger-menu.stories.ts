import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"hamburger-menu\" x-data=\"lilyCollapsible(false)\" x-bind=\"root\">\n  <button class=\"hamburger-menu-button\" x-bind=\"trigger\" aria-label=\"\" aria-controls=\"hamburger-menu-nav-1\">\n    <!-- Consumer provides the icon -->\n  </button>\n  <nav class=\"hamburger-menu-nav\" id=\"hamburger-menu-nav-1\" aria-label=\"\" x-bind=\"content\">\n    <!-- Consumer provides navigation content -->\n  </nav>\n</div>";

const meta = {
  title: 'Headless/Hamburger Menu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
