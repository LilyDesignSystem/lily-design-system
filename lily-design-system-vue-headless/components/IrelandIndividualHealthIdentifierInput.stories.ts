import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IrelandIndividualHealthIdentifierInput from './IrelandIndividualHealthIdentifierInput.vue';

const meta = {
  title: 'Headless/IrelandIndividualHealthIdentifierInput',
  component: IrelandIndividualHealthIdentifierInput,
  tags: ['autodocs']
} satisfies Meta<typeof IrelandIndividualHealthIdentifierInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
