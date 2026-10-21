import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LatvijaPersonasKodsView component -->\n<!--\n  Description: a read-only display of Latvia's Personas kods\n  HTML tag: <span>\n  CSS class: latvija-personas-kods-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st)\n  Usage:\n    <span class=\"latvija-personas-kods-view\" aria-label=\"Personal Code\">value-here</span>\n-->\n\n<span\n  class=\"latvija-personas-kods-view\"\n  aria-label=\"Personal Code\"\n></span>";

const meta = {
  title: 'Headless/Latvija Personas Kods View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
