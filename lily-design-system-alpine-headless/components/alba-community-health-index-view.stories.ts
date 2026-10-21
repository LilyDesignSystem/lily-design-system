import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AlbaCommunityHealthIndexView component -->\n<!--\n  Description: a read-only display of Scotland's Community Health Index (CHI)\n  HTML tag: <span>\n  CSS class: alba-community-health-index-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit\n  Usage:\n    <span class=\"alba-community-health-index-view\" aria-label=\"Community Health Index\">value-here</span>\n-->\n\n<span\n  class=\"alba-community-health-index-view\"\n  aria-label=\"Community Health Index\"\n></span>";

const meta = {
  title: 'Headless/Alba Community Health Index View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
