import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NederlandPaspoortNummerInput from './NederlandPaspoortNummerInput';

const meta = {
  title: 'Examples/NederlandPaspoortNummerInput',
  component: NederlandPaspoortNummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof NederlandPaspoortNummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NederlandPaspoortNummerInput' }
};
