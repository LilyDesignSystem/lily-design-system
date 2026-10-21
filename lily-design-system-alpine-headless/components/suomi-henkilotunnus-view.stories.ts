import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SuomiHenkilotunnusView component -->\n<!--\n  Description: a read-only display of Finland's Henkilötunnus (HETU)\n  HTML tag: <span>\n  CSS class: suomi-henkilotunnus-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum\n  Usage:\n    <span class=\"suomi-henkilotunnus-view\" aria-label=\"Personal Identity Code\">value-here</span>\n-->\n\n<span\n  class=\"suomi-henkilotunnus-view\"\n  aria-label=\"Personal Identity Code\"\n></span>";

const meta = {
  title: 'Headless/Suomi Henkilotunnus View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
