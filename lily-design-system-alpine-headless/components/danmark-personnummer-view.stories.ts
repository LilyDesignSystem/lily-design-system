import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DanmarkPersonnummerView component -->\n<!--\n  Description: a read-only display of Denmark's Personnummer (CPR-nummer) (CPR)\n  HTML tag: <span>\n  CSS class: danmark-personnummer-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY)\n  Usage:\n    <span class=\"danmark-personnummer-view\" aria-label=\"Personal Identity Code\">value-here</span>\n-->\n\n<span\n  class=\"danmark-personnummer-view\"\n  aria-label=\"Personal Identity Code\"\n></span>";

const meta = {
  title: 'Headless/Danmark Personnummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
