import RouteHeader from './components/RouteHeader';
import ItemDetail from './components/ItemDetail';
import RouteFooter from './components/RouteFooter';

class RouteDetail {
    constructor(routeHeader, itemDetails=[], routeFooter) {
        this.routeHeader = routeHeader;
        this.itemDetails = itemDetails;
        this.routeFooter = routeFooter;
    }
}

export default RouteDetail;