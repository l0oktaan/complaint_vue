<template>
  <div>
    <!-- Filter select component with search -->
    <v-select
      v-model="selectedCity"
      :items="cities"
      label="City"
      @input="filterItems" 
    ></v-select>

    <!-- Search input component -->
    <v-text-field
      v-model="search"
      label="Search"
      @input="filterItems" 
    ></v-text-field>

    <!-- Data table component -->
    <v-data-table
      :headers="headers"
      :items="filteredItems" 
    >
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.age }}</td>
        <td>{{ props.item.city }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Age', value: 'age' },
        { text: 'City', value: 'city' },
      ],
      items: [
        { name: 'John Doe', age: 25, city: 'New York' },
        { name: 'Jane Smith', age: 30, city: 'Los Angeles' },
        { name: 'Bob Johnson', age: 35, city: 'Chicago' },
      ],
      selectedCity: null, // Data property to store selected city
      search: '', // Data property to store search input
    };
  },
  computed: {
    filteredItems() {
      // Filter items based on selected city and search input
      return this.items.filter(item => {
        console.log('=====',item.city.toLowerCase());
        console.log('=====',this.selectedCity.toLowerCase());
        return (
          (this.selectedCity === null || item.city.toLowerCase() === this.selectedCity.toLowerCase()) &&
          (this.search === '' || item.name.toLowerCase().includes(this.search.toLowerCase()))
        );
      });
    },
    cities() {
      // Get unique city names from items data
      return Array.from(new Set(this.items.map(item => item.city)));
    },
  },
  methods: {
    filterItems() {
      // No need for manual update, computed property will automatically update filteredItems
      // when selectedCity or search changes
    },
  },
};
</script>