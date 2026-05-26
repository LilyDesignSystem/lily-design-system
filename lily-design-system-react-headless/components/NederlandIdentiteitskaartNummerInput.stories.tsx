import type { Meta, StoryObj } from '@storybook/react-vite';
import NederlandIdentiteitskaartNummerInput from './NederlandIdentiteitskaartNummerInput';

const meta = {
  title: 'Headless/NederlandIdentiteitskaartNummerInput',
  component: NederlandIdentiteitskaartNummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof NederlandIdentiteitskaartNummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NederlandIdentiteitskaartNummerInput' }
};
