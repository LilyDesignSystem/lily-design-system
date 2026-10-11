import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AustraliaIndividualHealthcareIdentifierView from './AustraliaIndividualHealthcareIdentifierView.vue';

const meta = {
  title: 'Headless/AustraliaIndividualHealthcareIdentifierView',
  component: AustraliaIndividualHealthcareIdentifierView,
  tags: ['autodocs']
} satisfies Meta<typeof AustraliaIndividualHealthcareIdentifierView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'AustraliaIndividualHealthcareIdentifierView' }
};
