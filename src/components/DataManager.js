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

  // Check for errors in RouteFooter
  const checkRouteFooterErrors = (routeFooter, itemDetails) => {
    let calculatedTotalUnits = 0;
    let calculatedTotalApprovedPA = 0;

    itemDetails.forEach((item) => {
      const units = parseInt(item.numberOfUnits, 10) || 0;
      const approvedPA = parseInt(item.approvedPAAmount, 10) / 100 || 0;

      if (item.unitsSign === '+') {
        calculatedTotalUnits += units;
      } else if (item.unitsSign === '-') {
        calculatedTotalUnits -= units;
      }

      if (item.approvedPASign === '+') {
        calculatedTotalApprovedPA += approvedPA;
      } else if (item.approvedPASign === '-') {
        calculatedTotalApprovedPA -= approvedPA;
      }
    });

    const totalUnitsAtRoute = parseInt(routeFooter.totalUnitsAtRoute, 10) || 0;
    const totalApprovedPAAtRoute = parseInt(routeFooter.totalApprovedPAAmountAtRoute, 10) || 0;

    const isUnitsMismatch = calculatedTotalUnits !== totalUnitsAtRoute;
    const isApprovedPAMismatch = calculatedTotalApprovedPA !== totalApprovedPAAtRoute;

    const isUnitsSignMismatch = calculatedTotalUnits > 0 && routeFooter.unitsSign === '-';
    const isPASignMismatch = calculatedTotalApprovedPA > 0 && routeFooter.paAmountSign === '-';

    return (
      isUnitsMismatch || isApprovedPAMismatch || isUnitsSignMismatch || isPASignMismatch
    );
  };

  // Row expansion template for route details
  const rowExpansionTemplate = (data) => {
  // Calculate total units and total approved PA
  let calculatedTotalUnits = 0;
  let calculatedTotalApprovedPA = 0;

  data.itemDetails.forEach((item) => {
    const units = parseInt(item.numberOfUnits, 10) || 0;
    const approvedPA = parseInt(item.approvedPAAmount, 10) / 100 || 0;

    if (item.unitsSign === '+') {
      calculatedTotalUnits += units;
    } else if (item.unitsSign === '-') {
      calculatedTotalUnits -= units;
    }

    if (item.approvedPASign === '+') {
      calculatedTotalApprovedPA += approvedPA;
    } else if (item.approvedPASign === '-') {
      calculatedTotalApprovedPA -= approvedPA;
    }
  });

  // Get routeFooter for easy access
  const { routeFooter } = data;

  // Check for specific mismatches in routeFooter
  const isUnitsMismatch = parseInt(routeFooter.totalUnitsAtRoute, 10) !== calculatedTotalUnits;
  const isApprovedPAMismatch = parseInt(routeFooter.totalApprovedPAAmountAtRoute, 10) !== calculatedTotalApprovedPA;

  // Conditional styles based on mismatch
  const unitsSignMismatch = isUnitsMismatch && routeFooter.unitsSign === '-';
  const paSignMismatch = isApprovedPAMismatch && routeFooter.paAmountSign === '-';

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
      <DataTable value={[routeFooter]} scrollable scrollHeight="150px" editMode="cell">
        <Column field="lineNumber" header="Line Number" />
        <Column field="registerType" header="Register Type" />
        <Column field="routeNumber" header="Route Number" />
        <Column field="returnCustomerNumber" header="Return Customer Number" />
        
        {/* Units Sign column with conditional styling */}
        <Column
          field="unitsSign"
          header="Units Sign"
          bodyStyle={{ backgroundColor: unitsSignMismatch ? '#f8d7da' : '' }}
        />
        
        {/* Total Units at Route column with conditional styling */}
        <Column
          field="totalUnitsAtRoute"
          header="Total Units at Route"
          bodyStyle={{ backgroundColor: isUnitsMismatch ? '#f8d7da' : '' }}
        />
        
        {/* PA Amount Sign column with conditional styling */}
        <Column
          field="paAmountSign"
          header="PA Amount Sign"
          bodyStyle={{ backgroundColor: paSignMismatch ? '#f8d7da' : '' }}
        />
        
        {/* Total Approved PA Amount at Route column with conditional styling */}
        <Column
          field="totalApprovedPAAmountAtRoute"
          header="Total Approved PA Amount at Route"
          bodyStyle={{ backgroundColor: isApprovedPAMismatch ? '#f8d7da' : '' }}
        />
      </DataTable>
    </div>
  );
};

const calculateFileFooterValidation = () => {
    let calculatedTotalApprovedPA = 0;
  
    // Loop through all routes and calculate the total Approved PA Amount considering the sign
    routeDetails.forEach((route) => {
      const routeFooterPAAmount = parseInt(route.routeFooter.totalApprovedPAAmountAtRoute, 10) || 0;
      const sign = route.routeFooter.paAmountSign === '+' ? 1 : -1; // Correctly handle the sign
      calculatedTotalApprovedPA += sign * routeFooterPAAmount; // Accumulate the calculated PA total
    });
  
    // Determine the expected sign for the calculated total
    const expectedPASign = calculatedTotalApprovedPA >= 0 ? '+' : '-';
    const absoluteCalculatedPA = Math.abs(calculatedTotalApprovedPA);
  
    // Now compare each file footer with the calculated total
    return fileFooters.map((footer) => {
      const footerPAAmount = parseInt(footer.totalApprovedPAAmount, 10) || 0;
      const footerPASign = footer.paAmountSign;
  
      // Check for mismatch in the PA Amount
      const isTotalPAMismatch = footerPAAmount !== absoluteCalculatedPA;
  
      // Check for mismatch in the PA Amount sign
      const isPASignMismatch = footerPASign !== expectedPASign;
  
      // Return the footer data along with mismatch indicators
      return {
        ...footer,
        isTotalPAMismatch,
        isPASignMismatch,
      };
    });
  };
  
  

  const renderFileFooterTable = () => {
    const validatedFileFooters = calculateFileFooterValidation();
  
    return (
      <DataTable value={validatedFileFooters} editMode="cell">
        <Column field="lineNumber" header="Line Number" />
        <Column field="registerType" header="Register Type" />
        <Column field="numberOfRoutes" header="Number of Routes" />
  
        {/* PA Amount Sign column */}
        <Column
          field="paAmountSign"
          header="PA Amount Sign"
          bodyStyle={(rowData) => ({
            backgroundColor: rowData.isPASignMismatch ? '#f8d7da' : '', // Red for mismatch
          })}
        />
  
        {/* Total Approved PA Amount column */}
        <Column
          field="totalApprovedPAAmount"
          header="Total Approved PA Amount"
          bodyStyle={(rowData) => ({
            backgroundColor: rowData.isTotalPAMismatch ? '#f8d7da' : '', // Red for mismatch
          })}
        />
      </DataTable>
    );
  };
   

  const rowClassName = (data) => {
    const hasError = checkRouteFooterErrors(data.routeFooter, data.itemDetails);
    return hasError ? 'error-row' : 'success-row';
  };

  const expandAll = () => {
    setExpandedRows(routeDetails);
  };

  const collapseAll = () => {
    setExpandedRows([]);
  };

  return (
    <div className="data-manager">
      <h2>Data Manager</h2>

      <h3>File Headers</h3>
      <DataTable value={fileHeaders} editMode="cell">
        <Column field="lineNumber" header="Line Number" />
        <Column field="registerType" header="Register Type" />
        <Column field="proposedSalesDate" header="Proposed Sales Date" />
      </DataTable>

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
          rowClassName={rowClassName}
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

      <h3>File Footers</h3>
      {renderFileFooterTable()}
    </div>
  );
};

export default DataManager;
