import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RomaniaCodNumericPersonalInput from './RomaniaCodNumericPersonalInput.vue';

const meta = {
  title: 'Headless/RomaniaCodNumericPersonalInput',
  component: RomaniaCodNumericPersonalInput,
  tags: ['autodocs']
} satisfies Meta<typeof RomaniaCodNumericPersonalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'RomaniaCodNumericPersonalInput' }
};
