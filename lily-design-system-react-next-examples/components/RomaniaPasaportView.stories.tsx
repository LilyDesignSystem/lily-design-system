import type { Meta, StoryObj } from '@storybook/react-vite';
import RomaniaPasaportView from './RomaniaPasaportView';

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
