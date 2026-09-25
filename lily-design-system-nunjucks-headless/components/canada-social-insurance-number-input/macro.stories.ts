import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="canada-social-insurance-number-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Canada's Social Insurance Number (SIN)">`;

const meta = {
  title: 'Headless/CanadaSocialInsuranceNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
