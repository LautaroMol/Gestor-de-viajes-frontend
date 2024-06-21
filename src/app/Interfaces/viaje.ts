export interface Viaje {
    IdViaje: number,
    Inicio: string,
    Final: string,
    Gastos: number[],
    Fecha: Date,
    Cp:number;
    Facturado: boolean,
    CuitUsuario: number,
    Distancia: number,
    Borrado: boolean
}
