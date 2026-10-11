import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RomaniaPasaportInput from './RomaniaPasaportInput.vue';

const meta = {
  title: 'Headless/RomaniaPasaportInput',
  component: RomaniaPasaportInput,
  tags: ['autodocs']
} satisfies Meta<typeof RomaniaPasaportInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'RomaniaPasaportInput' }
};
