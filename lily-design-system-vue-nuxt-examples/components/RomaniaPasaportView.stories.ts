import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RomaniaPasaportView from './RomaniaPasaportView.vue';

const meta = {
  title: 'Headless/RomaniaPasaportView',
  component: RomaniaPasaportView,
  tags: ['autodocs']
} satisfies Meta<typeof RomaniaPasaportView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'RomaniaPasaportView' }
};
