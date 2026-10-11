import type { Meta, StoryObj } from '@storybook/react-vite';
import SouthAfricaIdentityNumberInput from './SouthAfricaIdentityNumberInput';

const meta = {
  title: 'Headless/SouthAfricaIdentityNumberInput',
  component: SouthAfricaIdentityNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof SouthAfricaIdentityNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SouthAfricaIdentityNumberInput' }
};
