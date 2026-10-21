import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RomaniaPasaportInput component -->\n<!--\n  Description: an input for entering Romania's Paşaport\n  HTML tag: <input>\n  CSS class: romania-pasaport-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9]\n  Usage:\n    <input class=\"romania-pasaport-input\" type=\"text\" aria-label=\"Romanian Passport\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"romania-pasaport-input\"\n  type=\"text\"\n  aria-label=\"Romanian Passport\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Romania Pasaport Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
