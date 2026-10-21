import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"indonesia-nomor-induk-kependudukan-view\"\n  aria-label=\"Nomor Induk Kependudukan (NIK)\"\n></span>";

const meta = {
  title: 'Headless/Indonesia Nomor Induk Kependudukan View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
