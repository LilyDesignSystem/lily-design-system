import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ArgentinaCodigoUnicoDeIdentificacionLaboralInput from './ArgentinaCodigoUnicoDeIdentificacionLaboralInput.vue';

const meta = {
  title: 'Headless/ArgentinaCodigoUnicoDeIdentificacionLaboralInput',
  component: ArgentinaCodigoUnicoDeIdentificacionLaboralInput,
  tags: ['autodocs']
} satisfies Meta<typeof ArgentinaCodigoUnicoDeIdentificacionLaboralInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ArgentinaCodigoUnicoDeIdentificacionLaboralInput' }
};
