import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CanadaSocialInsuranceNumberInput from './CanadaSocialInsuranceNumberInput.vue';

const meta = {
  title: 'Headless/CanadaSocialInsuranceNumberInput',
  component: CanadaSocialInsuranceNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof CanadaSocialInsuranceNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CanadaSocialInsuranceNumberInput' }
};
