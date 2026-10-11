import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MaltaNationalIdentificationNumberInput from './MaltaNationalIdentificationNumberInput.vue';

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
