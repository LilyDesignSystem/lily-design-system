import type { Meta, StoryObj } from '@storybook/react-vite';
import EireIndividualHealthIdentifierInput from './EireIndividualHealthIdentifierInput';

const meta = {
  title: 'Headless/EireIndividualHealthIdentifierInput',
  component: EireIndividualHealthIdentifierInput,
  tags: ['autodocs']
} satisfies Meta<typeof EireIndividualHealthIdentifierInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
