import type { Meta, StoryObj } from '@storybook/react-vite';
import MaltaNationalIdentificationNumberInput from './MaltaNationalIdentificationNumberInput';

const meta = {
  title: 'Headless/MaltaNationalIdentificationNumberInput',
  component: MaltaNationalIdentificationNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof MaltaNationalIdentificationNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MaltaNationalIdentificationNumberInput' }
};
