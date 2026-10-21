import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- KyprosNationalPassportNumberInput component -->\n<!--\n  Description: an input for entering Kypros's National Passport Number\n  HTML tag: <input>\n  CSS class: kypros-national-passport-number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678)\n  Usage:\n    <input class=\"kypros-national-passport-number-input\" type=\"text\" aria-label=\"National Passport Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"kypros-national-passport-number-input\"\n  type=\"text\"\n  aria-label=\"National Passport Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Kypros National Passport Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
