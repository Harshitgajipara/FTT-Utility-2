class FileFooter {
    constructor(lineNumber, registerType, numberOfRoutes, paAmountSign, totalApprovedPAAmount) {
        this.lineNumber = lineNumber;
        this.registerType = registerType;
        this.numberOfRoutes = numberOfRoutes;
        this.paAmountSign = paAmountSign;
        this.totalApprovedPAAmount = totalApprovedPAAmount;
    }
}

export default FileFooter;