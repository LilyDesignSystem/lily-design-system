import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"turkiye-tc-kimlik-numarasi-input\"\n  type=\"text\"\n  aria-label=\"T.C. Kimlik Numarası\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Turkiye Tc Kimlik Numarasi Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
