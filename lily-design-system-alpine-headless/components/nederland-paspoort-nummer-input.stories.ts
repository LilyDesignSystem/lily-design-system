import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"nederland-paspoort-nummer-input\"\n  type=\"text\"\n  aria-label=\"Dutch Passport Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Nederland Paspoort Nummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
