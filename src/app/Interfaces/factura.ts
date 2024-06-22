export interface Factura {
    idFactura: number,
    usuario: number,
    cliente: number,
    cargas: number[],
    cuit:string;
    borrado:Boolean;
}
