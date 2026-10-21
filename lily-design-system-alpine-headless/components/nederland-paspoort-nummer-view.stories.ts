import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NederlandPaspoortNummerView component -->\n<!--\n  Description: a read-only display of Netherlands's Paspoort Nummer\n  HTML tag: <span>\n  CSS class: nederland-paspoort-nummer-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9]\n  Usage:\n    <span class=\"nederland-paspoort-nummer-view\" aria-label=\"Dutch Passport Number\">value-here</span>\n-->\n\n<span\n  class=\"nederland-paspoort-nummer-view\"\n  aria-label=\"Dutch Passport Number\"\n></span>";

const meta = {
  title: 'Headless/Nederland Paspoort Nummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
