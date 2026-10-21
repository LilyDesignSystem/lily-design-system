import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SverigePersonnummerView component -->\n<!--\n  Description: a read-only display of Sweden's Personnummer\n  HTML tag: <span>\n  CSS class: sverige-personnummer-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit\n  Usage:\n    <span class=\"sverige-personnummer-view\" aria-label=\"Personal Identity Number\">value-here</span>\n-->\n\n<span\n  class=\"sverige-personnummer-view\"\n  aria-label=\"Personal Identity Number\"\n></span>";

const meta = {
  title: 'Headless/Sverige Personnummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
