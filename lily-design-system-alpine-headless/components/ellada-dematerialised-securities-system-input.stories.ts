import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ElladaDematerialisedSecuritiesSystemInput component -->\n<!--\n  Description: an input for entering Greece's Dematerialised Securities System (DSS)\n  HTML tag: <input>\n  CSS class: ellada-dematerialised-securities-system-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece\n  Usage:\n    <input class=\"ellada-dematerialised-securities-system-input\" type=\"text\" aria-label=\"Dematerialised Securities System\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"ellada-dematerialised-securities-system-input\"\n  type=\"text\"\n  aria-label=\"Dematerialised Securities System\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Ellada Dematerialised Securities System Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
