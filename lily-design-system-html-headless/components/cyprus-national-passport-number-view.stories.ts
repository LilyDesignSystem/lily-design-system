import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="cyprus-national-passport-number-view"
  aria-label="National Passport Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/CyprusNationalPassportNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
