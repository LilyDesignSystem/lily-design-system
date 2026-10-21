import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LietuvaAsmensKodasInput component -->\n<!--\n  Description: an input for entering Lithuania's Asmens kodas\n  HTML tag: <input>\n  CSS class: lietuva-asmens-kodas-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit\n  Usage:\n    <input class=\"lietuva-asmens-kodas-input\" type=\"text\" aria-label=\"Personal Code\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"lietuva-asmens-kodas-input\"\n  type=\"text\"\n  aria-label=\"Personal Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Lietuva Asmens Kodas Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
