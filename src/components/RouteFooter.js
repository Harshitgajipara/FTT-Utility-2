class RouteFooter {

    constructor(lineNumber, registerType, routeNumber, returnCustomerNumber, unitsSign, totalUnitsAtRoute, paAmountSign, totalApprovedPAAmountAtRoute) {
        this.lineNumber = lineNumber;
        this.registerType = registerType;
        this.routeNumber = routeNumber;
        this.returnCustomerNumber = returnCustomerNumber;
        this.unitsSign = unitsSign;
        this.totalUnitsAtRoute = totalUnitsAtRoute;
        this.paAmountSign = paAmountSign;
        this.totalApprovedPAAmountAtRoute = totalApprovedPAAmountAtRoute;
    }

    getTotalApprovedPAAmountAtRoute() {
        return this.totalApprovedPAAmountAtRoute;
    }

}

export default RouteFooter;