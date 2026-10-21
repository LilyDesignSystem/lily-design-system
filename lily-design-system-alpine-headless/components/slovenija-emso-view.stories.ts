import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SlovenijaEmsoView component -->\n<!--\n  Description: a read-only display of Slovenia's Enotna Matična Številka Občana (EMŠO)\n  HTML tag: <span>\n  CSS class: slovenija-emso-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit\n  Usage:\n    <span class=\"slovenija-emso-view\" aria-label=\"Unique Master Citizen Number\">value-here</span>\n-->\n\n<span\n  class=\"slovenija-emso-view\"\n  aria-label=\"Unique Master Citizen Number\"\n></span>";

const meta = {
  title: 'Headless/Slovenija Emso View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
