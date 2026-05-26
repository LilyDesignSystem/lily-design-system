import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RomaniaCodNumericPersonalView from './RomaniaCodNumericPersonalView.vue';

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
