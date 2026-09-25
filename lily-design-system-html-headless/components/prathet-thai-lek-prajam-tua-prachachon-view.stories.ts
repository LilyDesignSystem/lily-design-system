import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="prathet-thai-lek-prajam-tua-prachachon-view"
  aria-label="เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)"
>sample-value</span>`;

const meta = {
  title: 'Headless/PrathetThaiLekPrajamTuaPrachachonView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
