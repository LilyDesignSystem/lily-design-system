import type { Meta, StoryObj } from '@storybook/react-vite';
import IrelandIndividualHealthIdentifierView from './IrelandIndividualHealthIdentifierView';

const meta = {
  title: 'Headless/IrelandIndividualHealthIdentifierView',
  component: IrelandIndividualHealthIdentifierView,
  tags: ['autodocs']
} satisfies Meta<typeof IrelandIndividualHealthIdentifierView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
