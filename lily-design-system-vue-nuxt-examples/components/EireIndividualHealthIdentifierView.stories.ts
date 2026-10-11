import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EireIndividualHealthIdentifierView from './EireIndividualHealthIdentifierView.vue';

const meta = {
  title: 'Headless/EireIndividualHealthIdentifierView',
  component: EireIndividualHealthIdentifierView,
  tags: ['autodocs']
} satisfies Meta<typeof EireIndividualHealthIdentifierView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
