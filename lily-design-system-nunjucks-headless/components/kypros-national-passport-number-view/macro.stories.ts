import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="kypros-national-passport-number-view"
  aria-label="National Passport Number">sample-value</span>`;

const meta = {
  title: 'Headless/KyprosNationalPassportNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
