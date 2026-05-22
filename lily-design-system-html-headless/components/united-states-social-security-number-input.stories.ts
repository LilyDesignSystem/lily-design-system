import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="united-states-social-security-number-input"
  type="text"
  aria-label=""
>`;

const meta = {
  title: 'Headless/UnitedStatesSocialSecurityNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
