<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-slate-800">Sistema de Votación</h1>
          <p class="text-slate-500 text-sm mt-1">Ingrese su cédula para ejercer su voto</p>
        </div>
      </template>

      <UFormField label="Cédula de Identidad" name="cedula">
        <UInput
          v-model="store.cedula"
          type="number"
          placeholder="Ej: 12345678"
          :disabled="store.loading || store.empleadoEncontrado"
          size="lg"
          class="w-full"
          @keyup.enter="store.buscarEmpleado"
        />
      </UFormField>

      <UButton
        v-if="!store.empleadoEncontrado"
        :loading="store.loading"
        :disabled="!store.puedeBuscar"
        color="primary"
        size="lg"
        block
        class="mt-4"
        @click="store.buscarEmpleado"
      >
        Buscar
      </UButton>

      <UAlert
        v-if="store.error"
        color="error"
        variant="soft"
        :title="store.error"
        icon="i-lucide-alert-circle"
        class="mt-4"
      />

      <UAlert
        v-if="store.mensajeExito"
        color="success"
        variant="soft"
        :title="store.mensajeExito"
        icon="i-lucide-check-circle"
        class="mt-4"
      />

      <div v-if="store.empleadoEncontrado && store.empleado" class="mt-6">
        <USeparator class="mb-4" />
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Empleado Encontrado</h2>

        <div class="space-y-2 mb-4">
          <p class="text-slate-700">
            <span class="font-medium">Nombre:</span>
            {{ store.empleado.nombre }} {{ store.empleado.apellido }}
          </p>
          <p class="text-slate-700">
            <span class="font-medium">Cédula:</span> {{ store.empleado.cedula }}
          </p>
          <p class="text-slate-700">
            <span class="font-medium">Cargo:</span> {{ store.empleado.cargo }}
          </p>
          <p class="text-slate-700">
            <span class="font-medium">Municipio:</span> {{ store.empleado.municipio }}
          </p>
          <p class="text-slate-700">
            <span class="font-medium">Parroquia:</span> {{ store.empleado.parroquia }}
          </p>
          <p class="text-slate-700">
            <span class="font-medium">Plantel:</span> {{ store.empleado.plantel }}
          </p>
          <p class="text-slate-700">
            <span class="font-medium">Dependencia:</span> {{ store.empleado.dependencia }}
          </p>
        </div>

        <UAlert
          v-if="store.yaVoto && !store.mensajeExito"
          color="warning"
          variant="soft"
          title="Este empleado ya ha ejercido su voto"
          icon="i-lucide-check-circle"
        />

        <UButton
          v-else
          :loading="store.votando"
          color="success"
          size="xl"
          block
          icon="i-lucide-vote"
          class="mt-2"          
          @click="store.registrarVoto"
        >
          VOTAR
        </UButton>

        <UButton
          color="neutral"
          variant="soft"
          block
          class="mt-3"
          @click="store.reiniciar"
        >
          Buscar otro empleado
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useVotacionStore } from '~/stores/votacion';
const store = useVotacionStore();

// watch(() => store.empleado, (nuevo) => {
//   // console.log('Empleado actual en el store:', nuevo);
// }, { deep: true });
</script>