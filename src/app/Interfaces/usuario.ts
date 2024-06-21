export interface Usuario {
    IdUsuario: number,
    Razon: string,
    Domicilio: string,
    Condicion: string,
    Cuit: string,
    Facturas:number[],
    Borrado:boolean
}
