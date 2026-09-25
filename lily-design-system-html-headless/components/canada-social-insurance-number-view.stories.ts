import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="canada-social-insurance-number-view"
  aria-label="Social Insurance Number (SIN)"
>sample-value</span>`;

const meta = {
  title: 'Headless/CanadaSocialInsuranceNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
