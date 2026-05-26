import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="australia-individual-healthcare-identifier-input"
  type="text"
  aria-label="Individual Healthcare Identifier"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/AustraliaIndividualHealthcareIdentifierInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
