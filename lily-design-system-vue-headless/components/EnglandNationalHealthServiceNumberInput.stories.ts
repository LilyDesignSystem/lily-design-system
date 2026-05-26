import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EnglandNationalHealthServiceNumberInput from './EnglandNationalHealthServiceNumberInput.vue';

const meta = {
  title: 'Headless/EnglandNationalHealthServiceNumberInput',
  component: EnglandNationalHealthServiceNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof EnglandNationalHealthServiceNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EnglandNationalHealthServiceNumberInput' }
};
