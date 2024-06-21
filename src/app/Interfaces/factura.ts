export interface Factura {
    IdFactura: number,
    Usuario: number,
    Cliente: number,
    Cargas: number[],
    Cuit:string;
    Borrado:Boolean;
}
