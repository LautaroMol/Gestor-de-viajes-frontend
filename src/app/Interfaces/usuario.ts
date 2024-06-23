export interface Usuario {
    idUsuario: number,
    razon: string,
    domicilio: string,
    condicion: string,
    cuit: string,
    facturas: number[],
    borrado: boolean
}
