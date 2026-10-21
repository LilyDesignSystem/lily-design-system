import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AustraliaIndividualHealthcareIdentifierView component -->\n<!--\n  Description: a read-only display of Australia's Individual Healthcare Identifier (IHI)\n  HTML tag: <span>\n  CSS class: australia-individual-healthcare-identifier-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 16 digits assigned by the Healthcare Identifiers Service\n  Usage:\n    <span class=\"australia-individual-healthcare-identifier-view\" aria-label=\"Individual Healthcare Identifier\">value-here</span>\n-->\n\n<span\n  class=\"australia-individual-healthcare-identifier-view\"\n  aria-label=\"Individual Healthcare Identifier\"\n></span>";

const meta = {
  title: 'Headless/Australia Individual Healthcare Identifier View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
