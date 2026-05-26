import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CyprusNationalPassportNumberInput from './CyprusNationalPassportNumberInput.vue';

const meta = {
  title: 'Headless/CyprusNationalPassportNumberInput',
  component: CyprusNationalPassportNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof CyprusNationalPassportNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CyprusNationalPassportNumberInput' }
};
