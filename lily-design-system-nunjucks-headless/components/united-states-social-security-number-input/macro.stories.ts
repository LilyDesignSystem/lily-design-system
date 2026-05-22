import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="united-states-social-security-number-input"
  type="text"
  id=""
  name=""
  value=""
  inputmode="numeric"
  pattern="[0-9 \\-]{9,11}"
  maxlength="11"
  autocomplete="off"
  spellcheck="false">`;

const meta = {
  title: 'Headless/UnitedStatesSocialSecurityNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
