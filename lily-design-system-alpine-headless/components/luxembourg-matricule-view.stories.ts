import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"luxembourg-matricule-view\"\n  aria-label=\"Numéro d'Identification Nationale (Matricule)\"\n></span>";

const meta = {
  title: 'Headless/Luxembourg Matricule View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
