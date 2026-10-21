import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NederlandPaspoortNummerInput component -->\n<!--\n  Description: an input for entering Netherlands's Paspoort Nummer\n  HTML tag: <input>\n  CSS class: nederland-paspoort-nummer-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9]\n  Usage:\n    <input class=\"nederland-paspoort-nummer-input\" type=\"text\" aria-label=\"Dutch Passport Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"nederland-paspoort-nummer-input\"\n  type=\"text\"\n  aria-label=\"Dutch Passport Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Nederland Paspoort Nummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
