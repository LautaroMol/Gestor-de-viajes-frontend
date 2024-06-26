export interface Viaje {
    idViaje: number,
    inicio: string,
    final: string,
    gastos: number[],
    fecha: Date,
    cp: number;
    facturado: boolean,
    cuitUsuario: number,
    distancia: number,
    borrado: boolean
}
