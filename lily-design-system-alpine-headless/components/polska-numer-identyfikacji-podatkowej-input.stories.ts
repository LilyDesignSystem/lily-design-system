import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PolskaNumerIdentyfikacjiPodatkowejInput component -->\n<!--\n  Description: an input for entering Poland's Numer Identyfikacji Podatkowej (NIP)\n  HTML tag: <input>\n  CSS class: polska-numer-identyfikacji-podatkowej-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 10 numeric digits used for tax identification\n  Usage:\n    <input class=\"polska-numer-identyfikacji-podatkowej-input\" type=\"text\" aria-label=\"Tax Identification Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"polska-numer-identyfikacji-podatkowej-input\"\n  type=\"text\"\n  aria-label=\"Tax Identification Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Polska Numer Identyfikacji Podatkowej Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
