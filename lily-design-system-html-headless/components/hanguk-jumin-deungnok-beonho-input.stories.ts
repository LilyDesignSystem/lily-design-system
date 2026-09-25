import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="hanguk-jumin-deungnok-beonho-input"
  type="text"
  aria-label="Resident Registration Number (주민등록번호)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/HangukJuminDeungnokBeonhoInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
