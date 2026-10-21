import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"one-time-password-input\"\n  type=\"text\"\n  inputmode=\"numeric\"\n  autocomplete=\"one-time-code\"\n  maxlength=\"6\"\n  pattern=\"[0-9]*\"\n  spellcheck=\"false\"\n  autocapitalize=\"off\"\n  aria-label=\"Verification code\"\n  data-length=\"6\"\n  name=\"code\"\n>";

const meta = {
  title: 'Headless/One Time Password Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
