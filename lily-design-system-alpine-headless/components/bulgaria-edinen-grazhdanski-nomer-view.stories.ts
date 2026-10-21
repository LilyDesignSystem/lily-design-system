import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BulgariaEdinenGrazhdanskiNomerView component -->\n<!--\n  Description: a read-only display of Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN)\n  HTML tag: <span>\n  CSS class: bulgaria-edinen-grazhdanski-nomer-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit\n  Usage:\n    <span class=\"bulgaria-edinen-grazhdanski-nomer-view\" aria-label=\"Uniform Civil Number\">value-here</span>\n-->\n\n<span\n  class=\"bulgaria-edinen-grazhdanski-nomer-view\"\n  aria-label=\"Uniform Civil Number\"\n></span>";

const meta = {
  title: 'Headless/Bulgaria Edinen Grazhdanski Nomer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
