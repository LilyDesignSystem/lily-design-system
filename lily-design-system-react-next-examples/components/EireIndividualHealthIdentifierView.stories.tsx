import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EireIndividualHealthIdentifierView from './EireIndividualHealthIdentifierView';

const meta = {
  title: 'Examples/EireIndividualHealthIdentifierView',
  component: EireIndividualHealthIdentifierView,
  tags: ['autodocs']
} satisfies Meta<typeof EireIndividualHealthIdentifierView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
