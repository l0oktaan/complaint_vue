

    <template>
      <v-row>
        <v-col>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="newDate"
                label="วันที่"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                dense
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="menu = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>

      </v-row>
    </template>
    <script>
    export default {
      props: ['show_date'],
      data: () => ({
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu: false,
        modal: false,
        menu2: false,
      }),
      created(){
        this.getnewDate()
      },
      watch:{
        show_date(){            
            if(this.show_date){
              this.date = this.show_date
                
            }
        },
          date(){
              console.log(this.date);
            this.getnewDate()
            this.$emit("change_date",this.date)

          }
      },  


      methods:{
        getnewDate(){
          
              if (this.date){
                  var d = new Date(this.date);
                  this.newDate = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
                  console.log(this.newDate);
              }
          },
      }
    }
  </script>