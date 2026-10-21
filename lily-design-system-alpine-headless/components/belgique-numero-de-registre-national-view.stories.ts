import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BelgiqueNumeroDeRegistreNationalView component -->\n<!--\n  Description: a read-only display of Belgium's Numéro de Registre National / Rijksregisternummer (NRN)\n  HTML tag: <span>\n  CSS class: belgique-numero-de-registre-national-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit\n  Usage:\n    <span class=\"belgique-numero-de-registre-national-view\" aria-label=\"National Register Number\">value-here</span>\n-->\n\n<span\n  class=\"belgique-numero-de-registre-national-view\"\n  aria-label=\"National Register Number\"\n></span>";

const meta = {
  title: 'Headless/Belgique Numero De Registre National View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
