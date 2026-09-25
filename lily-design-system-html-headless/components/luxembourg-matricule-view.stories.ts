import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="luxembourg-matricule-view"
  aria-label="Numéro d'Identification Nationale (Matricule)"
>sample-value</span>`;

const meta = {
  title: 'Headless/LuxembourgMatriculeView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
