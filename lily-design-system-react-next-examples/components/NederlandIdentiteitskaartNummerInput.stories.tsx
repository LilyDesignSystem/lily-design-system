import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NederlandIdentiteitskaartNummerInput from './NederlandIdentiteitskaartNummerInput';

const meta = {
  title: 'Examples/NederlandIdentiteitskaartNummerInput',
  component: NederlandIdentiteitskaartNummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof NederlandIdentiteitskaartNummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NederlandIdentiteitskaartNummerInput' }
};
