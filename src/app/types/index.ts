export type Usuario = {
    IdUsuario: number,
    Razon: string,
    Domicilio: string,
    Condicion: string,
    Cuit: string,
    Facturas?: number[],
    Borrado?: boolean
}   

export type Cliente = {
    IdCliente: number,
    Razon: string,
    Domicilio: string,
    Condicion: string,
    Cuit: string,
    Borrado?: boolean
}   

export type Viaje = {
    IdViaje: number,
    Inicio: string,
    Final: string,
    Gastos: number[],
    Fecha: Date,
    Cp?: number,
    Facturado: boolean,
    CuitUsuario: number,
    Distancia: number,
    Borrado?: boolean
}   

export type Carga = {
    IdCarga: number,
    Codigo: number,
    Producto: string,
    Cantidad: number,
    UnidadDeMedida: string,
    PrecioUnidad: number,
    Bonif: number,
    Subtotal: number,
    Iva: number,
    IdViaje: number,
    Borrado?: boolean
}

export type Gasto = {
    IdGasto: number,
    Nombre: string,
    Cantidad: number,
    Categoria?: number[],
    IdViaje: number,
    Fecha: Date,
    Borrado?: boolean
}

export type Categoria = {
    IdCategoria: number,
    Nombre: string,
    Borrado?: boolean
}

export type Factura = {
    IdFactura: number,
    IdUsuario: number,
    IdCliente: number,
    Cargas?: Carga[],
    Borrado?: boolean
}