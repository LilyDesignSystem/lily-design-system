import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import IrelandIndividualHealthIdentifierInput from './IrelandIndividualHealthIdentifierInput';

const meta = {
  title: 'Examples/IrelandIndividualHealthIdentifierInput',
  component: IrelandIndividualHealthIdentifierInput,
  tags: ['autodocs']
} satisfies Meta<typeof IrelandIndividualHealthIdentifierInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
