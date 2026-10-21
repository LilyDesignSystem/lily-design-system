import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"hanguk-jumin-deungnok-beonho-input\"\n  type=\"text\"\n  aria-label=\"Resident Registration Number (주민등록번호)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Hanguk Jumin Deungnok Beonho Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
