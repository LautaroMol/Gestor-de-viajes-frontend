export interface Usuario {
    idUsuario: number,
    razon: string,
    domicilio: string,
    condicion: string,
    cuitUsuario: string,
    facturas:number[],
    borrado:boolean
}
