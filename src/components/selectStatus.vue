<template>  
    <v-select
        v-model="selectedStatus"
        :items="statusCall"
        label="สถานะการดำเนินงาน"
        @input="filterItems" 
    ></v-select>
</template>

<script>
export default {
    data:() => ({
       selectedStatus: 'ทั้งหมด', // Data property to store selected city
        itemsStatus: [
          { value: 'ทั้งหมด', id: null },
          { value: 'รอรับเรื่อง', id: 0 },
          { value: 'อยู่ระหว่างดำเนินการ', id: 1 },
          { value: 'เรื่องเสร็จ', id: 2 },
          { value: 'สอบถามข้อมูลเพิ่มเติม', id: 3 },
          { value: 'ส่งต่อผู้เกี่ยวข้อง', id: 4 },
          { value: 'ตั้งคณะกรรมการสอบสวน', id: 5 },
        ],
    }),
    computed: {
        statusCall() {
            return Array.from(new Set(this.itemsStatus.map(itemsStatus => itemsStatus.value)));
        },
    },
    methods: {
        filterItems() {
            this.$forceUpdate();
        },
    },
}
</script>

<style>

</style>