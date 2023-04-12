<template>


   <v-file-input v-model="files" 
        small-chips 
        :show-size="1000"
        :accept="acceptTypes"
        :rules="fileRules"
        outlined
        multiple 
        dense
        clearable 
        single-line
        hide-details="auto"
        label="ไฟล์เเนบ"
        @change="fileAdded">
        <template v-slot:selection="{ text, index }">
            <v-chip small text-color="white" color="#295671" close @click:close="remove(index)">
                {{ text }}
            </v-chip>
        </template>
    </v-file-input>


    <!-- <v-file-input v-model="files" 
        small-chips 
        :show-size="1000"
        :accept="acceptTypes"
        :rules="fileRules"
        outlined
        placeholder="Select your files"
        multiple 
        clearable 
        label="Add files"
        single-line
        hide-details="auto"
        @change="fileAdded">
        <template v-slot:selection="{ text, index }">
            <v-chip small text-color="white" color="#295671" close @click:close="remove(index)">
                {{ text }}
            </v-chip>
        </template>
    </v-file-input> -->
</template>

<script>
export default {
    data: () => ({
        currFiles: [],
        previousFiles: [],
        files: [],
        acceptTypes: "image/*, application/pdf",
        fileRules: [
            value => {
            if (!value || value.length === 0) {
                return "Please select at least one file";
            }
            if (value.length > 10) {
                return "Maximum 10 files allowed";
            }
            const allowedTypes = ["image/png", "image/jpeg", "image/gif", "application/pdf"];
            for (let i = 0; i < value.length; i++) {
                const file = value[i];
                console.log(file);
                if (!allowedTypes.includes(file.type)) {
                return "File type not allowed";
                }
            }
            return true;
            }
        ],
    }),
    watch: {
        files(val) {
            this.previousFiles = val
        }  
    },

    methods:{
        remove (index) {
            console.log(index);
            this.files.splice(index, 1)
        },
        fileAdded () {
            if (this.previousFiles.length > 0) {
                this.files.push(...this.previousFiles)
            }
        }
    }
}
</script>

<style>

</style>