import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MaltaPassportNumberInput component -->\n<!--\n  Description: an input for entering Malta's Malta Passport Number\n  HTML tag: <input>\n  CSS class: malta-passport-number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 7 numerical digits issued by the Civil Registration Directorate\n  Usage:\n    <input class=\"malta-passport-number-input\" type=\"text\" aria-label=\"Malta Passport Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"malta-passport-number-input\"\n  type=\"text\"\n  aria-label=\"Malta Passport Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Malta Passport Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
