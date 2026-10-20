import { defineStore } from 'pinia';

export interface Empleado {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  yaVoto: boolean;
  cargo?: string;
  municipio?: string;
  parroquia?: string;
  plantel?: string;
  dependencia?: string;
}

interface State {
  cedula: string;
  empleado: Empleado | null;
  empleadoEncontrado: boolean;
  loading: boolean;
  votando: boolean;
  error: string;
  mensajeExito: string;
}

export const useVotacionStore = defineStore('votacion', {
  state: (): State => ({
    cedula: '',
    empleado: null,
    empleadoEncontrado: false,
    loading: false,
    votando: false,
    error: '',
    mensajeExito: '',
  }),

  getters: {
    puedeBuscar: (state): boolean =>
      String(state.cedula).trim().length > 0 && !state.loading,
    yaVoto: (state): boolean => state.empleado?.yaVoto === true,
  },

  actions: {
    async buscarEmpleado() {
      if (!this.cedula) return;

      this.loading = true;
      this.error = '';
      this.mensajeExito = '';
      this.empleado = null;
      this.empleadoEncontrado = false;

      const { $axios } = useNuxtApp();

      try {
        const { data } = await $axios.get('/buscar-empleado', {
          params: { cedula: this.cedula },
        });

        // console.log('Respuesta del Backend:', data);

        if (data.success) {
          this.empleado = data.empleados;
          this.empleadoEncontrado = true;
        }
      } catch (err: any) {
        this.error =
          err.response?.data?.statusMessage ||
          err.response?.data?.message ||
          'Error al buscar el empleado';
      } finally {
        this.loading = false;
      }
    },

    async registrarVoto() {
      if (!this.empleado) return;

      this.votando = true;
      this.error = '';
      this.mensajeExito = '';

      const { $axios } = useNuxtApp();

      try {
        const { data } = await $axios.post('/votar', {
          cedula: this.empleado.cedula,
        });

        if (data.success) {
          this.empleado.yaVoto = true;
          this.mensajeExito = data.mensaje;
        }
      } catch (err: any) {
        this.error =
          err.response?.data?.statusMessage ||
          err.response?.data?.message ||
          'Error al registrar el voto';
      } finally {
        this.votando = false;
      }
    },

    reiniciar() {
      this.cedula = '';
      this.empleado = null;
      this.empleadoEncontrado = false;
      this.error = '';
      this.mensajeExito = '';
    },
  },
});