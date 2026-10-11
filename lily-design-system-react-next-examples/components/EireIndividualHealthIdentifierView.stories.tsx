import type { Meta, StoryObj } from '@storybook/react-vite';
import EireIndividualHealthIdentifierView from './EireIndividualHealthIdentifierView';

const meta = {
  title: 'Headless/EireIndividualHealthIdentifierView',
  component: EireIndividualHealthIdentifierView,
  tags: ['autodocs']
} satisfies Meta<typeof EireIndividualHealthIdentifierView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
