import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"lietuva-pasas-input\"\n  type=\"text\"\n  aria-label=\"Lithuanian Passport\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Lietuva Pasas Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
