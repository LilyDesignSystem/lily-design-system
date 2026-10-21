import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MaltaNationalIdentificationNumberView component -->\n<!--\n  Description: a read-only display of Malta's Malta National Identification Number\n  HTML tag: <span>\n  CSS class: malta-national-identification-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 8 characters: 7 digits and a letter (A, B, G, H, L, M, P, or Z) that encodes geographic origin and registration era\n  Usage:\n    <span class=\"malta-national-identification-number-view\" aria-label=\"Malta National Identification Number\">value-here</span>\n-->\n\n<span\n  class=\"malta-national-identification-number-view\"\n  aria-label=\"Malta National Identification Number\"\n></span>";

const meta = {
  title: 'Headless/Malta National Identification Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
