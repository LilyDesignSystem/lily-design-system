import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EnglandNationalHealthServiceNumberView component -->\n<!--\n  Description: a read-only display of England's National Health Service Number (NHS)\n  HTML tag: <span>\n  CSS class: england-national-health-service-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service\n  Usage:\n    <span class=\"england-national-health-service-number-view\" aria-label=\"National Health Service Number\">value-here</span>\n-->\n\n<span\n  class=\"england-national-health-service-number-view\"\n  aria-label=\"National Health Service Number\"\n></span>";

const meta = {
  title: 'Headless/England National Health Service Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
