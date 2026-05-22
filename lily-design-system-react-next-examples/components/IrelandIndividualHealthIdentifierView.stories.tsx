import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import IrelandIndividualHealthIdentifierView from './IrelandIndividualHealthIdentifierView';

const meta = {
  title: 'Examples/IrelandIndividualHealthIdentifierView',
  component: IrelandIndividualHealthIdentifierView,
  tags: ['autodocs']
} satisfies Meta<typeof IrelandIndividualHealthIdentifierView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
