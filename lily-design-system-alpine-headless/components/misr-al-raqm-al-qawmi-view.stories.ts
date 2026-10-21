import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MisrAlRaqmAlQawmiView component -->\n<!--\n  Description: a read-only display of Egypt's National Number\n  HTML tag: <span>\n  CSS class: misr-al-raqm-al-qawmi-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Fourteen digits: century, date of birth, governorate, serial (sex parity), check digit.\n  Usage:\n    <span class=\"misr-al-raqm-al-qawmi-view\" aria-label=\"الرقم القومي (Al-Raqm Al-Qawmi)\">value-here</span>\n-->\n\n<span\n  class=\"misr-al-raqm-al-qawmi-view\"\n  aria-label=\"الرقم القومي (Al-Raqm Al-Qawmi)\"\n></span>";

const meta = {
  title: 'Headless/Misr Al Raqm Al Qawmi View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
