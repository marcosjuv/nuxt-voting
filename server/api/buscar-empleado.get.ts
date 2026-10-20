export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const cedula = query.cedula as string;

  if (!cedula || !/^\d+$/.test(cedula)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La cédula debe contener solo números',
    });
  }

  const cedulaNumero = Number(cedula);

  try {
    const empleados = await prisma.empleados.findUnique({
      where: { cedula: cedulaNumero },
    });

    if (!empleados) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Empleado no encontrado',
      });
    }

    return {
      success: true,
      empleados: {
        id: empleados.id,
        cedula: empleados.cedula,
        nombre: empleados.nombre_completo,
        cargo: empleados.cargo,
        municipio: empleados.municipio,
        parroquia: empleados.parroquia,
        plantel: empleados.plantel,
        dependencia: empleados.dependencia,
        yaVoto: empleados.voto === 1,
      },
    };
  } catch (error: any) {
    // console.error('ERROR PRISMA:', error);
    if (error.statusCode) throw error;
    throw createError({
    // statusCode: 500,
    // statusMessage: `Error BD: ${error.message}`
      statusCode: 500,
      statusMessage: 'Error al consultar la base de datos',
    });
  }
});