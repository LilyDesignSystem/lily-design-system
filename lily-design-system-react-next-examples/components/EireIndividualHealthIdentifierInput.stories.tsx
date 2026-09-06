import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EireIndividualHealthIdentifierInput from './EireIndividualHealthIdentifierInput';

const meta = {
  title: 'Examples/EireIndividualHealthIdentifierInput',
  component: EireIndividualHealthIdentifierInput,
  tags: ['autodocs']
} satisfies Meta<typeof EireIndividualHealthIdentifierInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
