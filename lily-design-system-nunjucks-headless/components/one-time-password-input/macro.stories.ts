import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input class="one-time-password-input" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" spellcheck="false" autocapitalize="off" aria-label="Security code" data-length="6" name="code">`;

const meta = {
  title: 'Headless/OneTimePasswordInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
