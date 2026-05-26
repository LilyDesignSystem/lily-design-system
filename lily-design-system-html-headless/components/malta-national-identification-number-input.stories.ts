import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="malta-national-identification-number-input"
  type="text"
  aria-label="Malta National Identification Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/MaltaNationalIdentificationNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
