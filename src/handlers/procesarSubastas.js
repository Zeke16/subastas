import { obtenerSubastasFinalizadas } from "../../lib/obtenerSubastasFinalizadas";
import { cerrarSubasta } from "../../lib/cerrarSubasta";
import createError from "http-errors";
const procesarSubastas = async (req, res) => {
  try {
    const subastasPorFinalizar = await obtenerSubastasFinalizadas();
    const cerrarSubastas = subastasPorFinalizar.map((subasta) =>
      cerrarSubasta(subasta)
    );
    await Promise.all(cerrarSubastas);

    return { 'Subastas_cerradas': cerrarSubastas.length };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
};

export const handler = procesarSubastas;
