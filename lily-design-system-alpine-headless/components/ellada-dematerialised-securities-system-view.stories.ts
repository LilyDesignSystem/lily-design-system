import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ElladaDematerialisedSecuritiesSystemView component -->\n<!--\n  Description: a read-only display of Greece's Dematerialised Securities System (DSS)\n  HTML tag: <span>\n  CSS class: ellada-dematerialised-securities-system-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece\n  Usage:\n    <span class=\"ellada-dematerialised-securities-system-view\" aria-label=\"Dematerialised Securities System\">value-here</span>\n-->\n\n<span\n  class=\"ellada-dematerialised-securities-system-view\"\n  aria-label=\"Dematerialised Securities System\"\n></span>";

const meta = {
  title: 'Headless/Ellada Dematerialised Securities System View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
