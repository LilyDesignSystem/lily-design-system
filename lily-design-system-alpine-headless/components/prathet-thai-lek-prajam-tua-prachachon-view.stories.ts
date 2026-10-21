import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"prathet-thai-lek-prajam-tua-prachachon-view\"\n  aria-label=\"เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)\"\n></span>";

const meta = {
  title: 'Headless/Prathet Thai Lek Prajam Tua Prachachon View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
