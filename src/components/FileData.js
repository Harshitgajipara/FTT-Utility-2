class FileData {
    constructor(fileHeader, routeDetail =[], fileFooter) {
        this.fileHeader = fileHeader;
        this.routeDetail = routeDetail;
        this.fileFooter = fileFooter;
    }
}

export default FileData;