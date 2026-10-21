import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LietuvaAsmensKodasView component -->\n<!--\n  Description: a read-only display of Lithuania's Asmens kodas\n  HTML tag: <span>\n  CSS class: lietuva-asmens-kodas-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit\n  Usage:\n    <span class=\"lietuva-asmens-kodas-view\" aria-label=\"Personal Code\">value-here</span>\n-->\n\n<span\n  class=\"lietuva-asmens-kodas-view\"\n  aria-label=\"Personal Code\"\n></span>";

const meta = {
  title: 'Headless/Lietuva Asmens Kodas View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
