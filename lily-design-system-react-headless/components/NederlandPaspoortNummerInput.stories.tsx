import type { Meta, StoryObj } from '@storybook/react-vite';
import NederlandPaspoortNummerInput from './NederlandPaspoortNummerInput';

const meta = {
  title: 'Headless/NederlandPaspoortNummerInput',
  component: NederlandPaspoortNummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof NederlandPaspoortNummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NederlandPaspoortNummerInput' }
};
