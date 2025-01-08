class ItemDetail {
    constructor(lineNumber, registerType, productCode, productDescription, unitsSign, numberOfUnits, grossSaleAmount, netAmountSign, netSaleAmount, approvedPASign, approvedPAAmount, adjustmentSign, adjustmentAmount, pePrice) {
        this.lineNumber = lineNumber;
        this.registerType = registerType;
        this.productCode = productCode;
        this.productDescription = productDescription;
        this.unitsSign = unitsSign;
        this.numberOfUnits = numberOfUnits;
        this.grossSaleAmount = grossSaleAmount;
        this.netAmountSign = netAmountSign;
        this.netSaleAmount = netSaleAmount;
        this.approvedPASign = approvedPASign;
        this.approvedPAAmount = approvedPAAmount;
        this.adjustmentSign = adjustmentSign;
        this.adjustmentAmount = adjustmentAmount;
        this.pePrice = pePrice;
    }
}

export default ItemDetail;