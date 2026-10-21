import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PilipinasPhilhealthIdentificationNumberView component -->\n<!--\n  Description: a read-only display of the Philippines' PhilHealth Identification Number (PIN)\n  HTML tag: <span>\n  CSS class: pilipinas-philhealth-identification-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.\n  Usage:\n    <span class=\"pilipinas-philhealth-identification-number-view\" aria-label=\"PhilHealth Identification Number (PIN)\">value-here</span>\n-->\n\n<span\n  class=\"pilipinas-philhealth-identification-number-view\"\n  aria-label=\"PhilHealth Identification Number (PIN)\"\n></span>";

const meta = {
  title: 'Headless/Pilipinas Philhealth Identification Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
