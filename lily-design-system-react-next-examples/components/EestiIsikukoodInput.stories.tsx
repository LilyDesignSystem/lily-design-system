import type { Meta, StoryObj } from '@storybook/react-vite';
import EestiIsikukoodInput from './EestiIsikukoodInput';

const meta = {
  title: 'Headless/EestiIsikukoodInput',
  component: EestiIsikukoodInput,
  tags: ['autodocs']
} satisfies Meta<typeof EestiIsikukoodInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EestiIsikukoodInput' }
};
