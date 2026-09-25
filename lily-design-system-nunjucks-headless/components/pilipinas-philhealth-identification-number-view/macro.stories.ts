import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="pilipinas-philhealth-identification-number-view"
  aria-label="the Philippines' PhilHealth Identification Number (PIN)">Sample value</span>`;

const meta = {
  title: 'Headless/PilipinasPhilhealthIdentificationNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
