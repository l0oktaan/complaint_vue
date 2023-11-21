<template>
    <div>
      <vue-excel-xlsx
          class="btn btn-export"
          :data="datas"
          :columns="columns"
          :file-name="`รายงานลงนามถวายพระพร เทศกาล${filename}`"
          :file-type="'xlsx'"
          :sheet-name="`เทศกาล${filename}`"
          >
          <i class="fa-solid fa-file-export icon-style"></i>
          export
      </vue-excel-xlsx>
    </div>
  </template>
  
  <script>
    //  import Swal from 'sweetalert2';
  export default {
    
      props: ['datas', 'columns', 'filename'],
      data(){
          return{
            //   datas: [],
            //   columns : [
            //       {
            //           label: "ชื่อ-สกุล",
            //           field: "name",
            //       },
            //       {
            //           label: "Browser",
            //           field: "browser",
            //       },
            //       {
            //           label: "Device",
            //           field: "device",
            //       },
            //       {
            //           label: "วันที่ลงนาม",
            //           field: "regis_date",
            //           // dataFormat: this.getThaiDate
            //       },
            //       {
            //           label: "IP",
            //           field: "ip_user",
            //       },
                 
            //   ],
              
          }
      },
    
    
  }
  </script>
  
  <style>
      .btn-export{
          padding: 5px 7px;
          border-radius: 5px;
          background: #4caf50;
          color: white;
      }
      .icon-style{
        font-size: 18px;
      }
  </style>