import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="hanguk-jumin-deungnok-beonho-view"
  aria-label="Resident Registration Number (주민등록번호)"
>sample-value</span>`;

const meta = {
  title: 'Headless/HangukJuminDeungnokBeonhoView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
