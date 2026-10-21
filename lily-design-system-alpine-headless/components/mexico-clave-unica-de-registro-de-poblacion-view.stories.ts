import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MexicoClaveUnicaDeRegistroDePoblacionView component -->\n<!--\n  Description: a read-only display of Mexico's Clave Única de Registro de Población (CURP)\n  HTML tag: <span>\n  CSS class: mexico-clave-unica-de-registro-de-poblacion-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.\n  Usage:\n    <span class=\"mexico-clave-unica-de-registro-de-poblacion-view\" aria-label=\"Clave Única de Registro de Población (CURP)\">value-here</span>\n-->\n\n<span\n  class=\"mexico-clave-unica-de-registro-de-poblacion-view\"\n  aria-label=\"Clave Única de Registro de Población (CURP)\"\n></span>";

const meta = {
  title: 'Headless/Mexico Clave Unica De Registro De Poblacion View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
