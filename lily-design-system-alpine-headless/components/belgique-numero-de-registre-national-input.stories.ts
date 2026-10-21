import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"belgique-numero-de-registre-national-input\"\n  type=\"text\"\n  aria-label=\"National Register Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Belgique Numero De Registre National Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
