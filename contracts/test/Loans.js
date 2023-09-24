const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Loans Contract", () => {
    let owner;
    let inquilino;

    before(async () => {
        [owner, inquilino] = await ethers.getSigners();
        const Loans = await ethers.getContractFactory("Loans");
        this.loans = await Loans.deploy();
        await this.loans.deployed();
    });

    it("Deployed successfully", async () => {
        const address = await this.loans.address;
        expect(address).to.not.equal(null);
        expect(address).to.not.equal(undefined);
        expect(address).to.not.equal(0x0);
        expect(address).to.not.equal("");
    });

    it("should create a new seguro with the correct properties", async () => {
        const montoAlquilerMensual = ethers.utils.parseEther("1.0");
        console.log();
        await this.loans
            .connect(owner)
            .crearSeguro(montoAlquilerMensual);

        // Get the details of the newly created seguro
        const seguro = await this.loans.seguros(0);

        // Assert that the seguro has the expected properties
        expect(seguro.inquilino).to.equal(ethers.constants.AddressZero);
        expect(seguro.propietario).to.equal(owner.address);
        expect(seguro.montoAlquilerMensual).to.equal(montoAlquilerMensual);
        // Add more assertions for other properties as needed
    });

    it("should allow inquilino to sign a contrato and pay the required deposit", async () => {
        const montoAlquilerMensual = ethers.utils.parseEther("1.0");
        const deposito = ethers.utils.parseEther("1.0");
        // Owner creates a new seguro
        await this.loans
            .connect(owner)
            .crearSeguro(montoAlquilerMensual);

        // Inquilino signs the contrato and pays the deposit
        await expect(() =>
            this.loans
                .connect(inquilino)
                .firmarContrato(0, { value: montoAlquilerMensual.add(deposito) })
        ).to.changeEtherBalance(inquilino, deposito.mul(-2));

        // Check that the seguro has been signed correctly
        const seguro = await this.loans.seguros(0);
        expect(seguro.inquilino).to.equal(inquilino.address);
        expect(seguro.estadoPago1).to.equal(1); // EstadoPago.Pagado
    });

    it("debe revertir el pago si la cantidad de pago es incorrecta", async () => {
        const montoAlquilerMensual = ethers.utils.parseEther("1.0");
        const deposito = ethers.utils.parseEther("0.5"); // Incorrect deposit amount
        await this.loans
            .connect(owner)
            .crearSeguro(montoAlquilerMensual);
        await expect(
            this.loans
                .connect(inquilino)
                .firmarContrato(1, { value: montoAlquilerMensual.add(deposito) })
        ).to.be.revertedWith("Debe pagar el deposito igual al monto del alquiler mensual");
    });

    it("should not allow inquilino to make a payment after the deadline has passed", async () => {
        const montoAlquilerMensual = ethers.utils.parseEther("1.0");
        const deposito = ethers.utils.parseEther("1.0");
        // Owner creates a new seguro
        await this.loans
            .connect(owner)
            .crearSeguro(montoAlquilerMensual);

        // Inquilino signs the contrato and pays the deposit
        await expect(() =>
            this.loans
                .connect(inquilino)
                .firmarContrato(3, { value: montoAlquilerMensual.add(deposito) })
        ).to.changeEtherBalance(inquilino, deposito.mul(-2));

        // Check that the seguro has been signed correctly
        const seguro = await this.loans.seguros(0);
        expect(seguro.inquilino).to.equal(inquilino.address);
        expect(seguro.estadoPago1).to.equal(1); // EstadoPago.Pagado
        console.log(seguro.inquilino);
        // Increase the time to simulate passing the deadline
        await network.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]); // 31 days


        // Inquilino tries to make a payment after the deadline
        await this.loans.connect(inquilino).pagarAlquiler(0, { value: montoAlquilerMensual })


    });



})

