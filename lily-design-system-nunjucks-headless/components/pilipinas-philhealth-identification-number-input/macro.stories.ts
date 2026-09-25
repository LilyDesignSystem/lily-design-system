import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="pilipinas-philhealth-identification-number-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="the Philippines' PhilHealth Identification Number (PIN)">`;

const meta = {
  title: 'Headless/PilipinasPhilhealthIdentificationNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
