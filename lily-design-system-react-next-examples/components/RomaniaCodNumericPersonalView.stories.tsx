import type { Meta, StoryObj } from '@storybook/react-vite';
import RomaniaCodNumericPersonalView from './RomaniaCodNumericPersonalView';

const meta = {
  title: 'Headless/RomaniaCodNumericPersonalView',
  component: RomaniaCodNumericPersonalView,
  tags: ['autodocs']
} satisfies Meta<typeof RomaniaCodNumericPersonalView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'RomaniaCodNumericPersonalView' }
};
