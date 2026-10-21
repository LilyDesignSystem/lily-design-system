import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NederlandIdentiteitskaartNummerView component -->\n<!--\n  Description: a read-only display of Netherlands's Identiteitskaart Nummer\n  HTML tag: <span>\n  CSS class: nederland-identiteitskaart-nummer-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted\n  Usage:\n    <span class=\"nederland-identiteitskaart-nummer-view\" aria-label=\"Dutch National Identity Card Number\">value-here</span>\n-->\n\n<span\n  class=\"nederland-identiteitskaart-nummer-view\"\n  aria-label=\"Dutch National Identity Card Number\"\n></span>";

const meta = {
  title: 'Headless/Nederland Identiteitskaart Nummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
