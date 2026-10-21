import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LiechtensteinPassportNumberView component -->\n<!--\n  Description: a read-only display of Liechtenstein's Liechtenstein Passport Number\n  HTML tag: <span>\n  CSS class: liechtenstein-passport-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 1 letter followed by 5 digits (e.g. R00536)\n  Usage:\n    <span class=\"liechtenstein-passport-number-view\" aria-label=\"Liechtenstein Passport Number\">value-here</span>\n-->\n\n<span\n  class=\"liechtenstein-passport-number-view\"\n  aria-label=\"Liechtenstein Passport Number\"\n></span>";

const meta = {
  title: 'Headless/Liechtenstein Passport Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
