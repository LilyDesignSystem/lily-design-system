import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BulgariaEdinenGrazhdanskiNomerInput component -->\n<!--\n  Description: an input for entering Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN)\n  HTML tag: <input>\n  CSS class: bulgaria-edinen-grazhdanski-nomer-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit\n  Usage:\n    <input class=\"bulgaria-edinen-grazhdanski-nomer-input\" type=\"text\" aria-label=\"Uniform Civil Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"bulgaria-edinen-grazhdanski-nomer-input\"\n  type=\"text\"\n  aria-label=\"Uniform Civil Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Bulgaria Edinen Grazhdanski Nomer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
