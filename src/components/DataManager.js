import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Import model classes
import FileHeader from './FileHeader';
import RouteHeader from './RouteHeader';
import ItemDetail from './ItemDetail';
import RouteFooter from './RouteFooter';
import FileFooter from './FileFooter';
import './DataManager.css';

const DataManager = ({ fileData }) => {
  const [fileHeaders, setFileHeaders] = useState([]);
  const [fileFooters, setFileFooters] = useState([]);
  const [routeDetails, setRouteDetails] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    parseFileData(fileData);
  }, [fileData]);

  const parseFileData = (lines) => {
    let tempFileHeaders = [];
    let tempRouteDetails = [];
    let tempFileFooters = [];
    let currentRouteGroup = { routeHeader: null, itemDetails: [], routeFooter: null };

    lines.forEach((line) => {
      let lastCharIndex = line.trim().length;

      // Set default value for unrecognized line formats
      if (lastCharIndex > 1 && ![14, 123, 43, 23].includes(lastCharIndex)) {
        lastCharIndex = 81;
      }

      switch (lastCharIndex) {
        case 14: // FileHeader
          if (currentRouteGroup.routeHeader) {
            tempRouteDetails.push(currentRouteGroup);
            currentRouteGroup = { routeHeader: null, itemDetails: [], routeFooter: null };
          }
          tempFileHeaders.push(new FileHeader(line.slice(0, 4), line.slice(4, 6), line.slice(6, 14)));
          break;

        case 81: // RouteHeader
          if (currentRouteGroup.routeHeader) {
            tempRouteDetails.push(currentRouteGroup);
            currentRouteGroup = { routeHeader: null, itemDetails: [], routeFooter: null };
          }
          currentRouteGroup.routeHeader = new RouteHeader(
            line.slice(0, 4),
            line.slice(4, 6),
            line.slice(6, 11),
            line.slice(11, 13),
            line.slice(13, 22),
            line.slice(22, 32),
            line.slice(32, 72),
            line.slice(72, 81)
          );
          break;

        case 123: // ItemDetail
          currentRouteGroup.itemDetails.push(
            new ItemDetail(
              line.slice(0, 4),
              line.slice(4, 6),
              line.slice(6, 12),
              line.slice(12, 52).trim(),
              line.slice(52, 53),
              line.slice(53, 61),
              line.slice(61, 74),
              line.slice(74, 75),
              line.slice(75, 88),
              line.slice(88, 89),
              line.slice(89, 102),
              line.slice(102, 103),
              line.slice(103, 116),
              line.slice(116, 123)
            )
          );
          break;

        case 43: // RouteFooter
          currentRouteGroup.routeFooter = new RouteFooter(
            line.slice(0, 4),
            line.slice(4, 6),
            line.slice(6, 11),
            line.slice(11, 20),
            line.slice(20, 21),
            line.slice(21, 29),
            line.slice(29, 30),
            line.slice(30, 43)
          );
          tempRouteDetails.push(currentRouteGroup);
          currentRouteGroup = { routeHeader: null, itemDetails: [], routeFooter: null };
          break;

        case 23: // FileFooter
          tempFileFooters.push(
            new FileFooter(line.slice(0, 4), line.slice(4, 6), line.slice(6, 9), line.slice(9, 10), line.slice(10, 23))
          );
          break;

        default:
          console.warn(`Unrecognized line format: ${line}`);
          break;
      }
    });

    setFileHeaders(tempFileHeaders);
    setRouteDetails(tempRouteDetails);
    setFileFooters(tempFileFooters);
  };

  // Row expansion template for route details
  const rowExpansionTemplate = (data) => {
    // Calculate total number of units based on the sign
    let calculatedTotalUnits = 0;
    data.itemDetails.forEach((item) => {
      const units = parseInt(item.numberOfUnits, 10) || 0;
      if (item.unitsSign === '+') {
        calculatedTotalUnits += units;
      } else if (item.unitsSign === '-') {
        calculatedTotalUnits -= units;
      }
    });
  
    // Check if the total units at route matches the calculated total
    const totalUnitsAtRoute = parseInt(data.routeFooter.totalUnitsAtRoute, 10) || 0;
    const isMismatch = calculatedTotalUnits !== totalUnitsAtRoute;
  
    return (
      <div>
        <h4>Item Details</h4>
        <DataTable value={data.itemDetails} scrollable scrollHeight="300px" editMode="cell">
          <Column field="lineNumber" header="Line Number" />
          <Column field="registerType" header="Register Type" />
          <Column field="productCode" header="Product Code" />
          <Column field="productDescription" header="Product Description" />
          <Column field="unitsSign" header="Units Sign" />
          <Column field="numberOfUnits" header="Number Of Units" />
          <Column field="grossSaleAmount" header="Gross Sale Amount" />
          <Column field="netAmountSign" header="Net Amount Sign" />
          <Column field="netSaleAmount" header="Net Sale Amount" />
          <Column field="approvedPASign" header="Approved PA Sign" />
          <Column field="approvedPAAmount" header="Approved PA Amount" />
          <Column field="adjustmentSign" header="Adjustment Sign" />
          <Column field="adjustmentAmount" header="Adjustment Amount" />
          <Column field="pePrice" header="PE Price" />
        </DataTable>
  
        <h4>Route Footer</h4>
        <DataTable value={[data.routeFooter]} scrollable scrollHeight="150px" editMode="cell">
          <Column field="lineNumber" header="Line Number" />
          <Column field="registerType" header="Register Type" />
          <Column field="routeNumber" header="Route Number" />
          <Column field="returnCustomerNumber" header="Return Customer Number" />
          <Column field="unitsSign" header="Units Sign" />
          <Column field="totalUnitsAtRoute" 
            header="Total Units at Route" 
            style={{ backgroundColor: isMismatch ? 'red' : '' }}  // Apply red background if mismatch
          />
          <Column field="paAmountSign" header="PA Amount Sign" />
          <Column field="totalApprovedPAAmountAtRoute" header="Total Approved PA Amount at Route" />
        </DataTable>
      </div>
    );
  };
  

  // Expand and collapse all rows
  const expandAll = () => {
    setExpandedRows(routeDetails);
  };

  const collapseAll = () => {
    setExpandedRows([]);
  };

  return (
    <div className="data-manager">
      <h2>Data Manager</h2>

      {/* File Header Table */}
      <h3>File Headers</h3>
      <DataTable value={fileHeaders} editMode="cell">
        <Column field="lineNumber" header="Line Number" />
        <Column field="registerType" header="Register Type" />
        <Column field="proposedSalesDate" header="Proposed Sales Date" />
      </DataTable>

      {/* Route Details Table */}
      <div className="route-details">
        <h3>Route Details</h3>
        <div className="flex flex-wrap justify-content-end gap-2">
          <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
          <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
        </div>
        <DataTable
          value={routeDetails}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="routeHeader.lineNumber"
        >
          <Column expander style={{ width: '3em' }} />
          <Column field="routeHeader.lineNumber" header="Line Number" />
          <Column field="routeHeader.registerType" header="Register Type" />
          <Column field="routeHeader.routeNumber" header="Route Number" />
          <Column field="routeHeader.executionSequence" header="Execution Sequence" />
          <Column field="routeHeader.returnCustomerNumber" header="Return Customer Number" />
          <Column field="routeHeader.employeeId" header="Employee ID" />
          <Column field="routeHeader.distributorName" header="Distributor Name" />
          <Column field="routeHeader.distributorCIF" header="Distributor CIF" />
        </DataTable>
      </div>

      {/* File Footer Table */}
      <h3>File Footers</h3>
      <DataTable value={fileFooters} editMode="cell">
        <Column field="lineNumber" header="Line Number" />
        <Column field="registerType" header="Register Type" />
        <Column field="numberOfRoutes" header="Number of Routes" />
        <Column field="paAmountSign" header="PA Amount Sign" />
        <Column field="totalApprovedPAAmount" header="Total Approved PA Amount" />
      </DataTable>
    </div>
  );
};

export default DataManager;
