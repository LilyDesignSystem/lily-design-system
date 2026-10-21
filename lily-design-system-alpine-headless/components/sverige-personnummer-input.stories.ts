import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SverigePersonnummerInput component -->\n<!--\n  Description: an input for entering Sweden's Personnummer\n  HTML tag: <input>\n  CSS class: sverige-personnummer-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit\n  Usage:\n    <input class=\"sverige-personnummer-input\" type=\"text\" aria-label=\"Personal Identity Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"sverige-personnummer-input\"\n  type=\"text\"\n  aria-label=\"Personal Identity Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Sverige Personnummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
