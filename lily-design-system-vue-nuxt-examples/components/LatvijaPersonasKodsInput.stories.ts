import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LatvijaPersonasKodsInput from './LatvijaPersonasKodsInput.vue';

const meta = {
  title: 'Headless/LatvijaPersonasKodsInput',
  component: LatvijaPersonasKodsInput,
  tags: ['autodocs']
} satisfies Meta<typeof LatvijaPersonasKodsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LatvijaPersonasKodsInput' }
};
