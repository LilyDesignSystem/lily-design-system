import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- OsterreichSozialversicherungsnummerView component -->\n<!--\n  Description: a read-only display of Austria's Sozialversicherungsnummer (SVNR)\n  HTML tag: <span>\n  CSS class: osterreich-sozialversicherungsnummer-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY).\n  Usage:\n    <span class=\"osterreich-sozialversicherungsnummer-view\" aria-label=\"Sozialversicherungsnummer (SVNR)\">value-here</span>\n-->\n\n<span\n  class=\"osterreich-sozialversicherungsnummer-view\"\n  aria-label=\"Sozialversicherungsnummer (SVNR)\"\n></span>";

const meta = {
  title: 'Headless/Osterreich Sozialversicherungsnummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
