import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PilipinasPhilhealthIdentificationNumberInput component -->\n<!--\n  Description: an input for entering the Philippines' PhilHealth Identification Number (PIN)\n  HTML tag: <input>\n  CSS class: pilipinas-philhealth-identification-number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.\n  Usage:\n    <input class=\"pilipinas-philhealth-identification-number-input\" type=\"text\" aria-label=\"PhilHealth Identification Number (PIN)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"pilipinas-philhealth-identification-number-input\"\n  type=\"text\"\n  aria-label=\"PhilHealth Identification Number (PIN)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Pilipinas Philhealth Identification Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
