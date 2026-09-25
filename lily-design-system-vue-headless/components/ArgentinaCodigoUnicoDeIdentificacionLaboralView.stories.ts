import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ArgentinaCodigoUnicoDeIdentificacionLaboralView from './ArgentinaCodigoUnicoDeIdentificacionLaboralView.vue';

const meta = {
  title: 'Headless/ArgentinaCodigoUnicoDeIdentificacionLaboralView',
  component: ArgentinaCodigoUnicoDeIdentificacionLaboralView,
  tags: ['autodocs']
} satisfies Meta<typeof ArgentinaCodigoUnicoDeIdentificacionLaboralView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ArgentinaCodigoUnicoDeIdentificacionLaboralView' }
};
