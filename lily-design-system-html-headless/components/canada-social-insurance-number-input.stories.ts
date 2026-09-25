import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="canada-social-insurance-number-input"
  type="text"
  aria-label="Social Insurance Number (SIN)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/CanadaSocialInsuranceNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
