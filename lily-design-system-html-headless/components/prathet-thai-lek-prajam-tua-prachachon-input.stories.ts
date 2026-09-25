import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="prathet-thai-lek-prajam-tua-prachachon-input"
  type="text"
  aria-label="เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/PrathetThaiLekPrajamTuaPrachachonInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
