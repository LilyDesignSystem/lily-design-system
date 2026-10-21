import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- UnitedKingdomNationalHealthServiceNumberView component -->\n<!--\n  Description: a read-only display of a UK NHS number\n  HTML tag: <span>\n  CSS class: united-kingdom-national-health-service-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"united-kingdom-national-health-service-number-view\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"united-kingdom-national-health-service-number-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/United Kingdom National Health Service Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
