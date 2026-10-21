import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MexicoClaveUnicaDeRegistroDePoblacionInput component -->\n<!--\n  Description: an input for entering Mexico's Clave Única de Registro de Población (CURP)\n  HTML tag: <input>\n  CSS class: mexico-clave-unica-de-registro-de-poblacion-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.\n  Usage:\n    <input class=\"mexico-clave-unica-de-registro-de-poblacion-input\" type=\"text\" aria-label=\"Clave Única de Registro de Población (CURP)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"mexico-clave-unica-de-registro-de-poblacion-input\"\n  type=\"text\"\n  aria-label=\"Clave Única de Registro de Población (CURP)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Mexico Clave Unica De Registro De Poblacion Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
