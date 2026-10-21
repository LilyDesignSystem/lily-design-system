import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"luxembourg-matricule-input\"\n  type=\"text\"\n  aria-label=\"Numéro d'Identification Nationale (Matricule)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Luxembourg Matricule Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
