// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Loans {
    enum EstadoPago {
        Pendiente,
        Pagado,
        Deudor
    }

    struct Seguro {
        address inquilino;
        address propietario;
        uint256 montoAlquilerMensual;
        uint256 fechaLimitePago1;
        uint256 fechaLimitePago2;
        uint256 fechaLimitePago3;
        EstadoPago estadoPago1;
        EstadoPago estadoPago2;
        EstadoPago estadoPago3;
        uint256 fechaDeFinSeguro;
        uint256 deposito;
    }

    mapping(uint256 => Seguro) public seguros;
    uint256 public contadorSeguros = 0;

    constructor() {}

    function crearSeguro(uint256 _montoAlquilerMensual) external {
        require(
            msg.sender != address(0),
            "El propietario debe ser una direccion valida."
        );

        Seguro memory nuevoSeguro;
        nuevoSeguro.inquilino = address(0); // El inquilino se establecerá más tarde
        nuevoSeguro.propietario = msg.sender;
        nuevoSeguro.montoAlquilerMensual = _montoAlquilerMensual;
        nuevoSeguro.fechaLimitePago1 = block.timestamp + 30 days; // Primer pago vence en 30 días
        nuevoSeguro.fechaLimitePago2 = nuevoSeguro.fechaLimitePago1 + 30 days;
        nuevoSeguro.fechaLimitePago3 = nuevoSeguro.fechaLimitePago2 + 30 days;
        nuevoSeguro.estadoPago1 = EstadoPago.Pendiente;
        nuevoSeguro.estadoPago2 = EstadoPago.Pendiente;
        nuevoSeguro.estadoPago3 = EstadoPago.Pendiente;
        nuevoSeguro.fechaDeFinSeguro = nuevoSeguro.fechaLimitePago3 + 5 days; // Cambio en la fecha de fin de seguro
        nuevoSeguro.deposito = _montoAlquilerMensual;

        seguros[contadorSeguros] = nuevoSeguro;
        contadorSeguros++;
    }

    function firmarContrato(uint256 _seguroId) external payable {
        require(_seguroId <= contadorSeguros, "El seguro no existe");
        Seguro storage seguro = seguros[_seguroId];

        require(
            msg.sender != address(0),
            "El inquilino debe ser una direccion valida"
        );
        require(
            msg.sender != seguro.propietario,
            "El propietario no puede ser el inquilino"
        );
        require(
            seguro.inquilino == address(0),
            "El seguro ya ha sido firmado por un inquilino"
        );
        require(
            msg.value == seguro.montoAlquilerMensual + seguro.deposito,
            "Debe pagar el deposito igual al monto del alquiler mensual"
        );

        seguro.inquilino = msg.sender;
        seguro.estadoPago1 = EstadoPago.Pagado; // Marcar el primer pago como Pagado
    }

    function pagarAlquiler(uint256 _seguroIndex) external payable {
        require(_seguroIndex <= contadorSeguros, "El seguro no existe");
        Seguro storage seguro = seguros[_seguroIndex];

        uint256 montoPendiente;
        uint256 fechaLimitePago;

        if (seguro.estadoPago2 == EstadoPago.Pendiente) {
            montoPendiente = seguro.montoAlquilerMensual;
            fechaLimitePago = seguro.fechaLimitePago2;
        } else if (seguro.estadoPago3 == EstadoPago.Pendiente) {
            montoPendiente = seguro.montoAlquilerMensual;
            fechaLimitePago = seguro.fechaLimitePago3;
        }
        require(
            block.timestamp <= fechaLimitePago,
            "El plazo para realizar el pago ha vencido."
        );

        if (montoPendiente > 0) {
            require(
                msg.value >= montoPendiente,
                "El monto pagado no es suficiente."
            );

            if (seguro.estadoPago2 == EstadoPago.Pendiente) {
                seguro.estadoPago2 = EstadoPago.Pagado;
            } else if (seguro.estadoPago3 == EstadoPago.Pendiente) {
                seguro.estadoPago3 = EstadoPago.Pagado;
            }
        }
    }

    function ejecutarSeguro(uint256 _seguroIndex) external {
        require(_seguroIndex <= contadorSeguros, "El seguro no existe");
        Seguro storage seguro = seguros[_seguroIndex];
        require(
            msg.sender == seguro.propietario,
            "Solo el propietario puede ejecutar el seguro."
        );

        require(
            seguro.estadoPago1 == EstadoPago.Deudor,
            "El seguro no puede ser ejecutado."
        );

        uint256 fechaPagoActual;

        if (seguro.estadoPago1 == EstadoPago.Pendiente) {
            fechaPagoActual = seguro.fechaLimitePago1;
        } else if (seguro.estadoPago2 == EstadoPago.Pendiente) {
            fechaPagoActual = seguro.fechaLimitePago2;
        } else if (seguro.estadoPago3 == EstadoPago.Pendiente) {
            fechaPagoActual = seguro.fechaLimitePago3;
        }

        require(
            block.timestamp > fechaPagoActual + 1 days,
            "No ha pasado suficiente tiempo desde la fecha de pago."
        );

        uint256 montoRescate = seguro.montoAlquilerMensual +
            (seguro.montoAlquilerMensual / 3);
        seguro.deposito -= montoRescate;
        seguro.fechaDeFinSeguro = block.timestamp;
        payable(msg.sender).transfer(montoRescate);
    }

    function finalizarContrato(uint256 _seguroIndex) external {
        require(_seguroIndex <= contadorSeguros, "El seguro no existe");
        Seguro storage seguro = seguros[_seguroIndex];
        require(
            msg.sender == seguro.inquilino,
            "Solo el inquilino puede finalizar el contrato."
        );

        require(
            seguro.estadoPago1 == EstadoPago.Pagado &&
                seguro.estadoPago2 == EstadoPago.Pagado &&
                seguro.estadoPago3 == EstadoPago.Pagado,
            "No se han realizado todos los pagos a tiempo."
        );

        uint256 montoTotalDepositado = seguro.deposito;
        seguro.deposito = 0;
        seguro.fechaDeFinSeguro = block.timestamp;

        payable(msg.sender).transfer(montoTotalDepositado);
    }

     function getSeguros() public view returns (Seguro[] memory) {
        Seguro[] memory seguroArray = new Seguro[](contadorSeguros);

        for (uint256 i = 0; i < contadorSeguros; i++) {
            seguroArray[i] = seguros[i];
        }

        return seguroArray;
    }
}
