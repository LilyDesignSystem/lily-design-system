import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AustraliaIndividualHealthcareIdentifierView from './AustraliaIndividualHealthcareIdentifierView';

const meta = {
  title: 'Examples/AustraliaIndividualHealthcareIdentifierView',
  component: AustraliaIndividualHealthcareIdentifierView,
  tags: ['autodocs']
} satisfies Meta<typeof AustraliaIndividualHealthcareIdentifierView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'AustraliaIndividualHealthcareIdentifierView' }
};
