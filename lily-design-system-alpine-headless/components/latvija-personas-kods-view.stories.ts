import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"latvija-personas-kods-view\"\n  aria-label=\"Personal Code\"\n></span>";

const meta = {
  title: 'Headless/Latvija Personas Kods View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
