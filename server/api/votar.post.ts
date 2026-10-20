export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { cedula } = body;

  if (!cedula || !/^\d+$/.test(cedula)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cédula inválida',
    });
  }

  try {
    // Actualización atómica: solo si voto = 0
    const result = await prisma.empleados.updateMany({
      where: {
        cedula,
        voto: 0,
      },
      data: {
        voto: 1,
      },
    });

    if (result.count === 0) {
      // Verificar si el empleado existe o ya votó
      const empleado = await prisma.empleados.findUnique({
        where: { cedula },
      });

      if (!empleado) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Empleado no encontrado',
        });
      }

      throw createError({
        statusCode: 409,
        statusMessage: 'Este empleado ya ha ejercido su voto',
      });
    }

    return {
      success: true,
      mensaje: '¡Voto registrado exitosamente!',
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al registrar el voto',
    });
  }
});