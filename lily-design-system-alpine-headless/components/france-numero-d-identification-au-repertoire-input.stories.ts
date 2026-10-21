import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"france-numero-d-identification-au-repertoire-input\"\n  type=\"text\"\n  aria-label=\"\"\n  inputmode=\"numeric\"\n  pattern=\"[0-9]{1} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{3} [0-9]{3} [0-9]{2}\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/France Numero DIdentification Au Repertoire Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
