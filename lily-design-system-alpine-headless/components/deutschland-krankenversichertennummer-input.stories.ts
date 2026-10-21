import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DeutschlandKrankenversichertennummerInput component -->\n<!--\n  Description: an input for entering Germany's Krankenversichertennummer (KVNR)\n  HTML tag: <input>\n  CSS class: deutschland-krankenversichertennummer-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: a random capital letter followed by eight random digits and a Luhn check digit\n  Usage:\n    <input class=\"deutschland-krankenversichertennummer-input\" type=\"text\" aria-label=\"Health Insurance Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"deutschland-krankenversichertennummer-input\"\n  type=\"text\"\n  aria-label=\"Health Insurance Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Deutschland Krankenversichertennummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
