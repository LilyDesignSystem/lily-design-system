import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MaltaPassportNumberView component -->\n<!--\n  Description: a read-only display of Malta's Malta Passport Number\n  HTML tag: <span>\n  CSS class: malta-passport-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 7 numerical digits issued by the Civil Registration Directorate\n  Usage:\n    <span class=\"malta-passport-number-view\" aria-label=\"Malta Passport Number\">value-here</span>\n-->\n\n<span\n  class=\"malta-passport-number-view\"\n  aria-label=\"Malta Passport Number\"\n></span>";

const meta = {
  title: 'Headless/Malta Passport Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
