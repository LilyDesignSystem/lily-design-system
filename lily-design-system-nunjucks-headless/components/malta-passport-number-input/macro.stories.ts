import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="malta-passport-number-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Malta Passport Number">`;

const meta = {
  title: 'Headless/MaltaPassportNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
