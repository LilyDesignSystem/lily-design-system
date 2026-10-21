import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CeskoCestovniPasView component -->\n<!--\n  Description: a read-only display of Czech Republic's Cestovní pas\n  HTML tag: <span>\n  CSS class: cesko-cestovni-pas-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior\n  Usage:\n    <span class=\"cesko-cestovni-pas-view\" aria-label=\"Czech Passport\">value-here</span>\n-->\n\n<span\n  class=\"cesko-cestovni-pas-view\"\n  aria-label=\"Czech Passport\"\n></span>";

const meta = {
  title: 'Headless/Cesko Cestovni Pas View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
