import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- FranceNumeroDIdentificationAuRepertoireInput component -->\n<!--\n  Description: an input for entering a France NIR unique national healthcare identifier\n  HTML tag: <input>\n  CSS class: france-numero-d-identification-au-repertoire-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"france-numero-d-identification-au-repertoire-input\" type=\"text\" aria-label=\"NIR\" inputmode=\"numeric\" pattern=\"[0-9]{1} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{3} [0-9]{3} [0-9]{2}\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"france-numero-d-identification-au-repertoire-input\"\n  type=\"text\"\n  aria-label=\"\"\n  inputmode=\"numeric\"\n  pattern=\"[0-9]{1} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{3} [0-9]{3} [0-9]{2}\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/France Numero DIdentification Au Repertoire Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
