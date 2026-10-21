import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"schweiz-ahv-nummer-input\"\n  type=\"text\"\n  aria-label=\"AHV-Nummer / Numéro AVS\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Schweiz Ahv Nummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
