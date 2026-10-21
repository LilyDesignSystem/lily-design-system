import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- KyprosNationalPassportNumberView component -->\n<!--\n  Description: a read-only display of Kypros's National Passport Number\n  HTML tag: <span>\n  CSS class: kypros-national-passport-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678)\n  Usage:\n    <span class=\"kypros-national-passport-number-view\" aria-label=\"National Passport Number\">value-here</span>\n-->\n\n<span\n  class=\"kypros-national-passport-number-view\"\n  aria-label=\"National Passport Number\"\n></span>";

const meta = {
  title: 'Headless/Kypros National Passport Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
