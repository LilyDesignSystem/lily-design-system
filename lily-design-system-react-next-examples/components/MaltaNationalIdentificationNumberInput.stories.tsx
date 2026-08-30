import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MaltaNationalIdentificationNumberInput from './MaltaNationalIdentificationNumberInput';

const meta = {
  title: 'Examples/MaltaNationalIdentificationNumberInput',
  component: MaltaNationalIdentificationNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof MaltaNationalIdentificationNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MaltaNationalIdentificationNumberInput' }
};
