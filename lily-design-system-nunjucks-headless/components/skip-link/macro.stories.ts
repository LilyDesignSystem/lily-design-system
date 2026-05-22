import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="skip-link"
  href="#main-content">Skip to main content</a>`;

const meta = {
  title: 'Headless/SkipLink',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
