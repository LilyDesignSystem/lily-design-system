import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="pilipinas-philhealth-identification-number-view"
  aria-label="PhilHealth Identification Number (PIN)"
>sample-value</span>`;

const meta = {
  title: 'Headless/PilipinasPhilhealthIdentificationNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
