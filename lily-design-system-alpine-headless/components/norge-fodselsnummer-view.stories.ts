import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NorgeFodselsnummerView component -->\n<!--\n  Description: a read-only display of Norway's Fødselsnummer\n  HTML tag: <span>\n  CSS class: norge-fodselsnummer-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 11 digits where the first 6 represent the date of birth (DDMMYY)\n  Usage:\n    <span class=\"norge-fodselsnummer-view\" aria-label=\"Norwegian Birth Number\">value-here</span>\n-->\n\n<span\n  class=\"norge-fodselsnummer-view\"\n  aria-label=\"Norwegian Birth Number\"\n></span>";

const meta = {
  title: 'Headless/Norge Fodselsnummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
