class RouteHeader {
    constructor(lineNumber, registerType, routeNumber, executionSequence, returnCustomerNumber, employeeId, distributorName, distributorCIF) {
        this.lineNumber = lineNumber;
        this.registerType = registerType;
        this.routeNumber = routeNumber;
        this.executionSequence = executionSequence;
        this.returnCustomerNumber = returnCustomerNumber;
        this.employeeId = employeeId;
        this.distributorName = distributorName;
        this.distributorCIF = distributorCIF;
    }
}

export default RouteHeader;