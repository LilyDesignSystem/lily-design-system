import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- FranceNumeroDIdentificationAuRepertoireView component -->\n<!--\n  Description: a read-only display of a France NIR unique national healthcare identifier\n  HTML tag: <span>\n  CSS class: france-numero-d-identification-au-repertoire-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"france-numero-d-identification-au-repertoire-view\" aria-label=\"NIR\">1 85 05 75 012 345 67</span>\n-->\n\n<span\n  class=\"france-numero-d-identification-au-repertoire-view\"\n  aria-label=\"\"\n></span>";

const meta = {
  title: 'Headless/France Numero DIdentification Au Repertoire View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
