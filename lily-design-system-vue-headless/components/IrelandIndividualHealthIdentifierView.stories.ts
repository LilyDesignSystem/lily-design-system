import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IrelandIndividualHealthIdentifierView from './IrelandIndividualHealthIdentifierView.vue';

const meta = {
  title: 'Headless/IrelandIndividualHealthIdentifierView',
  component: IrelandIndividualHealthIdentifierView,
  tags: ['autodocs']
} satisfies Meta<typeof IrelandIndividualHealthIdentifierView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
