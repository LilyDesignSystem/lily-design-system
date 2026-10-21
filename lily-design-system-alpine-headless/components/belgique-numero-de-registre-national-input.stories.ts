import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BelgiqueNumeroDeRegistreNationalInput component -->\n<!--\n  Description: an input for entering Belgium's Numéro de Registre National / Rijksregisternummer (NRN)\n  HTML tag: <input>\n  CSS class: belgique-numero-de-registre-national-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit\n  Usage:\n    <input class=\"belgique-numero-de-registre-national-input\" type=\"text\" aria-label=\"National Register Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"belgique-numero-de-registre-national-input\"\n  type=\"text\"\n  aria-label=\"National Register Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Belgique Numero De Registre National Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
