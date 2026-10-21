import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MisrAlRaqmAlQawmiInput component -->\n<!--\n  Description: an input for entering Egypt's National Number\n  HTML tag: <input>\n  CSS class: misr-al-raqm-al-qawmi-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Fourteen digits: century, date of birth, governorate, serial (sex parity), check digit.\n  Usage:\n    <input class=\"misr-al-raqm-al-qawmi-input\" type=\"text\" aria-label=\"الرقم القومي (Al-Raqm Al-Qawmi)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"misr-al-raqm-al-qawmi-input\"\n  type=\"text\"\n  aria-label=\"الرقم القومي (Al-Raqm Al-Qawmi)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Misr Al Raqm Al Qawmi Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
