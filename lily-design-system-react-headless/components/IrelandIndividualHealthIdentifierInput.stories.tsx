import type { Meta, StoryObj } from '@storybook/react-vite';
import IrelandIndividualHealthIdentifierInput from './IrelandIndividualHealthIdentifierInput';

const meta = {
  title: 'Headless/IrelandIndividualHealthIdentifierInput',
  component: IrelandIndividualHealthIdentifierInput,
  tags: ['autodocs']
} satisfies Meta<typeof IrelandIndividualHealthIdentifierInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
