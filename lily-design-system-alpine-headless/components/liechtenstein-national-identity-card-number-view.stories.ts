import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LiechtensteinNationalIdentityCardNumberView component -->\n<!--\n  Description: a read-only display of Liechtenstein's Liechtenstein National Identity Card Number\n  HTML tag: <span>\n  CSS class: liechtenstein-national-identity-card-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card\n  Usage:\n    <span class=\"liechtenstein-national-identity-card-number-view\" aria-label=\"Liechtenstein National Identity Card Number\">value-here</span>\n-->\n\n<span\n  class=\"liechtenstein-national-identity-card-number-view\"\n  aria-label=\"Liechtenstein National Identity Card Number\"\n></span>";

const meta = {
  title: 'Headless/Liechtenstein National Identity Card Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
