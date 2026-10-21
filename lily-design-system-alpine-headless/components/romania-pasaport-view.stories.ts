import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"romania-pasaport-view\"\n  aria-label=\"Romanian Passport\"\n></span>";

const meta = {
  title: 'Headless/Romania Pasaport View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
