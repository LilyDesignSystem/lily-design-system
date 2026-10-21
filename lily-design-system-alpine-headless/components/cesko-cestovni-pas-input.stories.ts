import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CeskoCestovniPasInput component -->\n<!--\n  Description: an input for entering Czech Republic's Cestovní pas\n  HTML tag: <input>\n  CSS class: cesko-cestovni-pas-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior\n  Usage:\n    <input class=\"cesko-cestovni-pas-input\" type=\"text\" aria-label=\"Czech Passport\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"cesko-cestovni-pas-input\"\n  type=\"text\"\n  aria-label=\"Czech Passport\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Cesko Cestovni Pas Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
