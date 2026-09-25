import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="luxembourg-matricule-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Numéro d'Identification Nationale (Matricule)">`;

const meta = {
  title: 'Headless/LuxembourgMatriculeInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
