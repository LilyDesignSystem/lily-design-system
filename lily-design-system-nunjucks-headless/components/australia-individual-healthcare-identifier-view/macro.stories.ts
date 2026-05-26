import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="australia-individual-healthcare-identifier-view"
  aria-label="Individual Healthcare Identifier">sample-value</span>`;

const meta = {
  title: 'Headless/AustraliaIndividualHealthcareIdentifierView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
