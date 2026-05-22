import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<nav
  class="accordion-nav" aria-label="Accordion"></nav>`;

const meta = {
  title: 'Headless/AccordionNav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
