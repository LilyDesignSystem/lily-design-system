import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"nederland-identiteitskaart-nummer-input\"\n  type=\"text\"\n  aria-label=\"Dutch National Identity Card Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Nederland Identiteitskaart Nummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
