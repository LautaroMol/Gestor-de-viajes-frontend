export interface Unidad {
    idUnidad: number;
    marca: string;
    modelo: string;
    idUsuario: number;
    valoracion: number;
    amortizacion: number;
    ruedas: number[];
    estadoRueda: number[];
    aceite: Date;
    kmAceite: number;
}