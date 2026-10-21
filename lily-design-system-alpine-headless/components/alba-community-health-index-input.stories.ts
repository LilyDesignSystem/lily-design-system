import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AlbaCommunityHealthIndexInput component -->\n<!--\n  Description: an input for entering Scotland's Community Health Index (CHI)\n  HTML tag: <input>\n  CSS class: alba-community-health-index-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit\n  Usage:\n    <input class=\"alba-community-health-index-input\" type=\"text\" aria-label=\"Community Health Index\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"alba-community-health-index-input\"\n  type=\"text\"\n  aria-label=\"Community Health Index\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Alba Community Health Index Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
