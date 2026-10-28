import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<nav class=\"navigation-menu\" aria-label=\"\" data-overflow=\"true\" x-data=\"lilyNavigationMenu\">\n  <ul class=\"navigation-menu-list\">\n    <!-- Consumer provides <li> items -->\n    <li class=\"navigation-menu-more\" hidden>\n      <button class=\"navigation-menu-more-button\" type=\"button\" aria-expanded=\"false\">\n        <!-- Consumer provides the More label -->\n      </button>\n      <ul class=\"navigation-menu-more-list\" hidden></ul>\n    </li>\n  </ul>\n</nav>";

const meta = {
  title: 'Headless/Navigation Menu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
