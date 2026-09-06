import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EireIndividualHealthIdentifierInput from './EireIndividualHealthIdentifierInput.vue';

const meta = {
  title: 'Examples/EireIndividualHealthIdentifierInput',
  component: EireIndividualHealthIdentifierInput,
  tags: ['autodocs']
} satisfies Meta<typeof EireIndividualHealthIdentifierInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
