import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"lietuva-pasas-view\"\n  aria-label=\"Lithuanian Passport\"\n></span>";

const meta = {
  title: 'Headless/Lietuva Pasas View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
