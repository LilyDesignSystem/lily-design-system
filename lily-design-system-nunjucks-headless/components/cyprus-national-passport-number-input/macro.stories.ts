import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="cyprus-national-passport-number-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="National Passport Number">`;

const meta = {
  title: 'Headless/CyprusNationalPassportNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
