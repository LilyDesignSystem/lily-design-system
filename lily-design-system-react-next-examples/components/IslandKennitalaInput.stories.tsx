import type { Meta, StoryObj } from '@storybook/react-vite';
import IslandKennitalaInput from './IslandKennitalaInput';

const meta = {
  title: 'Headless/IslandKennitalaInput',
  component: IslandKennitalaInput,
  tags: ['autodocs']
} satisfies Meta<typeof IslandKennitalaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'IslandKennitalaInput' }
};
