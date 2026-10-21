import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AustraliaIndividualHealthcareIdentifierInput component -->\n<!--\n  Description: an input for entering Australia's Individual Healthcare Identifier (IHI)\n  HTML tag: <input>\n  CSS class: australia-individual-healthcare-identifier-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 16 digits assigned by the Healthcare Identifiers Service\n  Usage:\n    <input class=\"australia-individual-healthcare-identifier-input\" type=\"text\" aria-label=\"Individual Healthcare Identifier\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"australia-individual-healthcare-identifier-input\"\n  type=\"text\"\n  aria-label=\"Individual Healthcare Identifier\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Australia Individual Healthcare Identifier Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
