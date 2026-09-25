import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="pilipinas-philhealth-identification-number-input"
  type="text"
  aria-label="PhilHealth Identification Number (PIN)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/PilipinasPhilhealthIdentificationNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
