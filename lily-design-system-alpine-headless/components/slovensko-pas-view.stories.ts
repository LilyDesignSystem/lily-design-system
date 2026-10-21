import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SlovenskoPasView component -->\n<!--\n  Description: a read-only display of Slovakia's Pas\n  HTML tag: <span>\n  CSS class: slovensko-pas-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years\n  Usage:\n    <span class=\"slovensko-pas-view\" aria-label=\"Slovak Passport\">value-here</span>\n-->\n\n<span\n  class=\"slovensko-pas-view\"\n  aria-label=\"Slovak Passport\"\n></span>";

const meta = {
  title: 'Headless/Slovensko Pas View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
