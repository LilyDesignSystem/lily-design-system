import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<section
  class="government-identifier">
  <div class="government-identifier-masthead">  </div>
  <nav
    class="government-identifier-links"  ></nav>
</section>`;

const meta = {
  title: 'Headless/GovernmentIdentifier',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
