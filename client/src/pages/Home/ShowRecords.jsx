import React, { useState, useEffect, memo, useRef } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Styles from './ShowRecords.module.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaFilePdf } from "react-icons/fa6";
import { VscRefresh } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import PulseLoader from "react-spinners/PulseLoader";
import { message } from "antd";
const diseaseAppPort = process.env.REACT_APP_DISEASE_APP_PORT;

const useStyles = makeStyles((theme) => ({

  textField: {
    '& .MuiInputBase-root': {
      color: 'red', // This changes the font color
      backgroundColor: 'var(--primary-color-background)',
      '& fieldset': {
        borderColor: 'var(--secondary-color-background)', // This changes the border color
      },
      '&:hover fieldset': {
        borderColor: 'var(--hover-color-background)', // This changes the border color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--secondary-color-text)', // This changes the border color when focused
      },
    },
    '& .MuiInputLabel-root': {
      color: 'var(--secondary-color-text)', // This changes the label color
    },
    '& .MuiInputBase-input': {
      '&::placeholder': {
        color: 'var(--plotly-legend-border-color)',
      },
    },
  },
}));




const formatDate = (dateStr) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(dateStr);
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} '${year.toString().slice(-2)}`;
};
const RecordsTable = memo(({
  recordType,
  infoId,
  shouldRefresh,
  additionalDiseaseNames,
  handleAdditionalDiseaseNamesChange,
  handleProcessAdditionalDiseases,
  formData,
  classes,
  updateShortDesc,
  handleSetInfoId,
  isNewSearch,
  loading
}) => {

  const tableRef = useRef(null);

  const handleDownloadPDF = async () => {
    console.log('Download PDF');
    if (!tableRef.current) {
      console.error('Table ref is null');
      return;
    }
    console.log(tableRef);
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('table.pdf');
  };

  const [records, setRecords] = useState([]);
  const [showRecords, setShowRecords] = useState(true);
  const [dateRange, setDateRange] = useState(null); // New state for date range
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const formatDateNew = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to get the correct month (0-indexed)
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };


  useEffect(() => {
    // Add logic here to fetch data or perform any actions when infoId changes
    console.log('infoId changed:', infoId);
  }, [infoId]);
  useEffect(() => {
    const getUpdatedShortDesc = () => {
      // Determine the updated value for formData.shortDesc based on the records
      const updatedShortDesc = records.length > 0 ? records[0][3] : ''; // Assuming the disease name is in the 5th column

      // Call the updateShortDesc callback function to update formData.shortDesc in the App component
      updateShortDesc(updatedShortDesc);
    };

    getUpdatedShortDesc();
  }, [records]);

  const fetchRecords = async () => {
    try {
      console.log(infoId, recordType)
      let response;
      if (infoId) {
        console.log(infoId);
        console.log(recordType);
        response = await axios.get(`http://localhost:${diseaseAppPort}/infoid_records?info_id=${infoId}`);
        // Fetch date range from the backend
        const dateRangeResponse = await axios.get(`http://localhost:${diseaseAppPort}/info_records?info_id=${infoId}`);
        console.log('Date range response:', dateRangeResponse.data)
        if (dateRangeResponse.data.length > 0) {
          const data_from = dateRangeResponse.data[0][3];
          const data_upto = dateRangeResponse.data[0][4];
          setDateRange({ from: data_from, to: data_upto });

        }

      }
      else if (recordType === 'completed') {
        response = await axios.get(`http://localhost:${diseaseAppPort}/latest_records_completed`);
        if (response.data.length > 0) {
          const firstRecord = response.data[0];
          const fetchedInfoId = firstRecord[1]; // Assuming info_id is in the second column
          handleSetInfoId(fetchedInfoId);
          const dateRangeResponse = await axios.get(`http://localhost:${diseaseAppPort}/info_records?info_id=${fetchedInfoId}`);
          console.log('Date range response:', dateRangeResponse.data)
          if (dateRangeResponse.data.length > 0) {
            if (dateRangeResponse.data.length > 0) {
              const data_from = dateRangeResponse.data[0][3];
              const data_upto = dateRangeResponse.data[0][4];
              setDateRange({ from: data_from, to: data_upto });
            }
          }
        }
      } else if (recordType === 'processing') {

        console.log("SDS")
        response = await axios.get(`http://localhost:${diseaseAppPort}/latest_records_processing`);
        if (response.data.length > 0) {
          const firstRecord = response.data[0];
          const fetchedInfoId = firstRecord[1]; // Assuming info_id is in the second column
          handleSetInfoId(fetchedInfoId);
          const dateRangeResponse = await axios.get(`http://localhost:${diseaseAppPort}/info_records?info_id=${fetchedInfoId}`);
          console.log('Date range response:', dateRangeResponse.data)
          if (dateRangeResponse.data.length > 0) {
            console.log("efsfsdf")
            const data_from = dateRangeResponse.data[0][3];
            const data_upto = dateRangeResponse.data[0][4];
            setDateRange({ from: data_from, to: data_upto });
          }

        }
        else {

          const data_from = null;
          const data_upto = null;
          setDateRange({ from: data_from, to: data_upto });
        }
      }

      if (response) {
        console.log('Records fetched:', response.data);
        setRecords(response.data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };
  useEffect(() => {

    fetchRecords();
  }, [infoId, shouldRefresh, recordType]);


  const handleDeleteRecord = async (srNo) => {
    try {
      const response = await axios.delete(`http://localhost:${diseaseAppPort}/delete_record`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          info_id: infoId,
          sr_no: srNo
        }
      });
      console.log('Record deleted:', response.data);
      message.success("The record has been successfully deleted.")
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      message.error("Error deleting record")
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false); // Close delete confirmation popup
  };
  return (
    <div>
      <Dialog open={showDeleteConfirmation} onClose={handleCloseDeleteConfirmation}>
        <DialogTitle>Record Deleted</DialogTitle>
        <DialogContent>The record has been successfully deleted.</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="primary" >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {showRecords && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {dateRange && (
              <h4>
                ({formatDate(dateRange.from)} to {formatDate(dateRange.to)})
              </h4>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h5>
              <div style={{ marginRight: '12px' }}>Dated:</div>
              <div>{records[0]?.[10] ? formatDateNew(records[0][10]) : ''}</div>
            </h5>
          </div>
        </div>
      )}
      <div className={Styles.searchdiv}>
        <TextField
          label="Add Keywords (separated by commas)"
          value={additionalDiseaseNames}
          onChange={handleAdditionalDiseaseNamesChange}
          variant="outlined"
          className={classes.textField}
        />
        <button
          disabled={loading}
          style={{
            width: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
          onClick={handleProcessAdditionalDiseases}>
          {!loading ? " Process Additional Keywords"
            : <PulseLoader />}
        </button>
      </div>
      <div className={Styles.buttons}>
        <button onClick={handleDownloadPDF} className={Styles.download_button}>
          <FaFilePdf />&nbsp;Download
        </button>
        <button onClick={fetchRecords} className={Styles.download_button}>
          <VscRefresh />  Refresh
        </button>
      </div>
      <div className={Styles.scrollable}>
        {showRecords && (
          <table ref={tableRef} id='SearchTable'>
            <thead className={Styles.heading_cont} >
              <tr>
                <th className={Styles.table_heading}>Keyword</th>
                <th className={Styles.table_heading}> VISITS <br /> (Based on primary diagnosis on arrival)</th>
                <th className={Styles.table_heading}>PATIENTS <br />(Distinct based on visits)</th>
                <th className={Styles.table_heading}>DISCHARGE SUMMARIES</th>
                <th className={Styles.table_heading}>DS PATIENTS<br />(Distinct based on discharge summaries)</th>
                <th className={Styles.table_heading}>Action</th>
              </tr>
            </thead>
            <tbody  >
              {records.map((record, index) => (
                <tr key={record[0]}  >
                  <td className={Styles.content_cont}><span className={Styles.item_center}>{record[4]}</span></td>
                  <td className={Styles.content_cont}><span className={Styles.item_center}>{record[5] ? record[5] : "..."}</span></td>
                  <td className={Styles.content_cont}><span className={Styles.item_center}>{record[6] ? record[6] : "..."}</span></td>
                  <td className={Styles.content_cont}><span className={Styles.item_center}> {record[7] ? record[7] : "..."}</span></td>
                  <td className={Styles.content_cont}><span className={Styles.item_center}>{record[8] ? record[8] : "..."}</span></td>
                  <td className={Styles.content_cont}>
                    <span
                      className={Styles.colorhover}
                      onClick={() => handleDeleteRecord(record[2])}
                    >
                      <MdDelete />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div >
  );
});

export default RecordsTable;