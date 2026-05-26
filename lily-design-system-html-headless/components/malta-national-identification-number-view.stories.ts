import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="malta-national-identification-number-view"
  aria-label="Malta National Identification Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/MaltaNationalIdentificationNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
