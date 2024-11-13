export interface Viaje {
    idViaje: number,
    inicio: string,
    final: string,
    gastos: number[],
    fecha: Date,
    cp: string,
    facturado: boolean,
    amortizado: boolean,
    cuitUsuario: number,
    distancia: number,
    totalFacturado: number,
    borrado: boolean
}
