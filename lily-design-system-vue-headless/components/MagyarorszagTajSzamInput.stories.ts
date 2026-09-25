import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MagyarorszagTajSzamInput from './MagyarorszagTajSzamInput.vue';

const meta = {
  title: 'Headless/MagyarorszagTajSzamInput',
  component: MagyarorszagTajSzamInput,
  tags: ['autodocs']
} satisfies Meta<typeof MagyarorszagTajSzamInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MagyarorszagTajSzamInput' }
};
