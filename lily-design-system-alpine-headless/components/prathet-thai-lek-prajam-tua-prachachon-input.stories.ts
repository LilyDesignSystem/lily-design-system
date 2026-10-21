import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"prathet-thai-lek-prajam-tua-prachachon-input\"\n  type=\"text\"\n  aria-label=\"เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Prathet Thai Lek Prajam Tua Prachachon Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
