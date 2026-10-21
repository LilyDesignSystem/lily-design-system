import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DeutschlandKrankenversichertennummerView component -->\n<!--\n  Description: a read-only display of Germany's Krankenversichertennummer (KVNR)\n  HTML tag: <span>\n  CSS class: deutschland-krankenversichertennummer-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: a random capital letter followed by eight random digits and a Luhn check digit\n  Usage:\n    <span class=\"deutschland-krankenversichertennummer-view\" aria-label=\"Health Insurance Number\">value-here</span>\n-->\n\n<span\n  class=\"deutschland-krankenversichertennummer-view\"\n  aria-label=\"Health Insurance Number\"\n></span>";

const meta = {
  title: 'Headless/Deutschland Krankenversichertennummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
