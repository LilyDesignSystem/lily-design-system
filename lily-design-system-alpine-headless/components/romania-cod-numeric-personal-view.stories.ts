import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RomaniaCodNumericPersonalView component -->\n<!--\n  Description: a read-only display of Romania's Cod Numeric Personal (CNP)\n  HTML tag: <span>\n  CSS class: romania-cod-numeric-personal-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit\n  Usage:\n    <span class=\"romania-cod-numeric-personal-view\" aria-label=\"Personal Numerical Code\">value-here</span>\n-->\n\n<span\n  class=\"romania-cod-numeric-personal-view\"\n  aria-label=\"Personal Numerical Code\"\n></span>";

const meta = {
  title: 'Headless/Romania Cod Numeric Personal View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
