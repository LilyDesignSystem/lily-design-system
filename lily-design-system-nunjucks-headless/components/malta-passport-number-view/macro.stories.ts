import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="malta-passport-number-view"
  aria-label="Malta Passport Number">sample-value</span>`;

const meta = {
  title: 'Headless/MaltaPassportNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
