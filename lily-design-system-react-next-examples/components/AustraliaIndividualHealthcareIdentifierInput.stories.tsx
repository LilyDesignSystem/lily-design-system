import type { Meta, StoryObj } from '@storybook/react-vite';
import AustraliaIndividualHealthcareIdentifierInput from './AustraliaIndividualHealthcareIdentifierInput';

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
