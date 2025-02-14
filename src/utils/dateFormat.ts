export const formatAMPM = (date: Date): string => {
  let hours: number | string = date.getHours();
  const minutes: number | string = date.getMinutes();
  const ampm: string = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12; // Convierte a formato 12 horas
  hours = hours ? hours : 12; // La hora '0' debe ser '12'

  const strMinutes: number | string = minutes < 10 ? '0' + minutes : minutes; // Agrega un cero si es necesario

  return `${hours}:${strMinutes} ${ampm}`; // Retorna el tiempo formateado
};
