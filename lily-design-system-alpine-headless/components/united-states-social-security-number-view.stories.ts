import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- UnitedStatesSocialSecurityNumberView component -->\n<!--\n  Description: a read-only display of a US Social Security number\n  HTML tag: <span>\n  CSS class: united-states-social-security-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"united-states-social-security-number-view\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"united-states-social-security-number-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/United States Social Security Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
