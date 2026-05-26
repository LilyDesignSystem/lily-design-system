import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AustraliaIndividualHealthcareIdentifierInput from './AustraliaIndividualHealthcareIdentifierInput.vue';

const meta = {
  title: 'Headless/AustraliaIndividualHealthcareIdentifierInput',
  component: AustraliaIndividualHealthcareIdentifierInput,
  tags: ['autodocs']
} satisfies Meta<typeof AustraliaIndividualHealthcareIdentifierInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'AustraliaIndividualHealthcareIdentifierInput' }
};
