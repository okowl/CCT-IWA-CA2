import React, {forwardRef} from 'react';
import MaterialTable from 'material-table';
import CreateResultCard from './CreateResultCard.react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

  
const addEntry = (newData, refetch, setUpdateResult, tableResolve) => {
  return fetch("/api/playlist", {
        method: 'post',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(newData)
    }).then(
        (res) => {
            if (res.status !== 200) {
                setUpdateResult({err: `Looks like there was a problem. Status Code: ${res.status}`});
                return;
            }
            
            res.json().then(function(data) {
                setUpdateResult({data});
                tableResolve();
                refetch();
                setTimeout(() => {
                    setUpdateResult(null);
                }, 5000)
            });
        }
    );
}

const removeEntry = (id, refetch, setUpdateResult, tableResolve) => {
  return fetch(`/api/playlist/${id}`, {
        method: 'delete',
    }).then(
        (res) => {
            if (res.status !== 200) {
                setUpdateResult({err: `Looks like there was a problem. Status Code: ${res.status}`});
                return;
            }
            
            res.json().then(function(data) {
                setUpdateResult({data}); // ?
                tableResolve();
                refetch();
            });
        }
    );
}



const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

export default function PlaylistTable({refetch, fetchResult}) {
    const [updateResult, setUpdateResult] = React.useState(null);
   
    const columns = [
        { title: 'Title', field: 'title' },
        { title: 'Channel', field: 'channel' },
        { title: 'Published date', field: 'published_date' },
        { title: 'Link', field: 'url'},
    ];

  if (!fetchResult || !fetchResult.data || fetchResult.data.length === 0) {
    return 'No playlist data yet';
  }
  
  return (
    <div style={{ maxWidth: "100%" }}>
    { updateResult ? 
        <CreateResultCard result={updateResult}/> : null}
        <MaterialTable
        icons={tableIcons}
        title="Playlist Table"
        columns={columns}
        data={fetchResult.data}
        editable={{
            onRowAdd: (newData) => new Promise((resolve, reject) => {
                return addEntry(newData, refetch, setUpdateResult, resolve);
            }),
            onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
                return addEntry(newData, refetch, setUpdateResult, resolve);
            }),
            onRowDelete: (oldData) => new Promise((resolve, reject) => {
                return removeEntry(oldData._id, refetch, setUpdateResult, resolve);
            }),
        }}
        />
  </div>
  );
}
