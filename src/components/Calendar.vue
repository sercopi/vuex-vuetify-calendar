<template>
<v-row class="fill-height">
    <v-col>
        <v-sheet height="64">
            <v-toolbar flat class="d-none d-md-flex">
                <v-btn color="primary" class="mr-4" @click="dialog.value = true" dark>New Event</v-btn>

                <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Today</v-btn>
                <v-btn fab text small color="grey darken-2" @click="prev">
                    <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn fab text small color="grey darken-2" @click="next">
                    <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                    {{
            $refs.calendar.title
            }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu bottom class="ml-auto">
                    <template class="float-right" v-slot:activator="{ on, attrs }">
                        <v-btn class="ml-5" outlined color="grey darken-2" v-bind="attrs" v-on="on">
                            <span>{{ typeToLabel[type] }}</span>
                            <v-icon right>mdi-menu-down</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item @click="type = 'day'">
                            <v-list-item-title>Day</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'week'">
                            <v-list-item-title>Week</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'month'">
                            <v-list-item-title>Month</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = '4day'">
                            <v-list-item-title>4 days</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-toolbar>

            <v-btn fab text class="float-left d-flex d-md-none" color="grey darken-2" @click="prev">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text class="float-left d-flex d-md-none" color="grey darken-2" @click="next">
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn class="float-right d-flex d-md-none" color="primary" @click="drawer=true">
                <v-icon large>mdi-calendar</v-icon>
            </v-btn>
            <v-navigation-drawer v-model="drawer" absolute right temporary app>
                <v-list>
                    <v-list-item-group>
                        <v-list-item>
                            <v-list-item-content>
                                <v-btn color="primary" class="mr-4" @click="dialog.value = true" dark>New Event</v-btn>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Today</v-btn>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-navigation-drawer>
        </v-sheet>
        <v-dialog v-model="dialog.value" max-width="500">
            <v-card>
                <v-container>
                    <v-form @submit.prevent="addEventForm">
                        <v-text-field v-model="newEvent.value.name" type="text" label="event name (required)"></v-text-field>

                        <v-text-field v-model="newEvent.value.start" type="date" label="start (required)"></v-text-field>
                        <v-text-field v-model="newEvent.value.end" type="date" label="end (required)"></v-text-field>
                        <v-text-field v-model="newEvent.value.timeStart" type="time" label="time start"></v-text-field>
                        <v-text-field v-model="newEvent.value.timeStop" type="time" label="time end"></v-text-field>
                        <v-text-field v-model="newEvent.value.color" type="color" label="color (click to open color menu)"></v-text-field>
                        <ckeditor :editor="editor.editor" v-model="newEvent.value.details" :config="editor.editorConfig"></ckeditor>

                        <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog.value = false">Create Event</v-btn>
                    </v-form>
                </v-container>
            </v-card>
        </v-dialog>
        <v-sheet height="600">
            <v-calendar ref="calendar" v-model="focus" color="primary" :events="filteredEvents" :event-color="getEventColor" :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay"></v-calendar>
            <v-menu :close-on-content-click="false" v-model="selectedOpen" :activator="selectedElement" offset-x>
                <v-card color="grey lighten-4" min-width="350px" flat>
                    <v-toolbar :color="selectedEvent.color" dark>
                        <v-btn @click="deleteEventForm(selectedEvent)" icon>
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <form v-if="currentlyEditing !== selectedEvent.id">
                            <div v-html="selectedEvent.details"></div>
                            <div>starts: {{selectedEvent.start.substr(0,10)}} at {{selectedEvent.timeStart}}</div>
                            <div>ends: {{selectedEvent.end.substr(0,10)}} at {{selectedEvent.timeStop}}</div>
                        </form>
                        <form v-else action>
                            <v-text-field v-model="selectedEvent.name" type="text" label="event name (required)"></v-text-field>
                            <v-text-field v-model="selectedEvent.start" :max="selectedEvent.stop" type="date" label="start (required)"></v-text-field>
                            <v-text-field v-model="selectedEvent.end" :min="selectedEvent.start" type="date" label="end (required)"></v-text-field>
                            <v-text-field v-model="selectedEvent.timeStart" type="time" label="time start"></v-text-field>
                            <v-text-field v-model="selectedEvent.timeStop" type="time" label="time end"></v-text-field>
                            <v-text-field v-model="selectedEvent.color" type="color" label="color (click to open color menu)"></v-text-field>

                            <ckeditor :editor="editor.editor" v-model="selectedEvent.details" :config="editor.editorConfig"></ckeditor>
                        </form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="secondary" @click="selectedOpen = false">Close</v-btn>
                        <v-btn text v-if="currentlyEditing !== selectedEvent.id" @click.prevent="editEvent()">Edit</v-btn>
                        <v-btn text v-else @click.prevent="updateEventForm()">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </v-sheet>
    </v-col>
</v-row>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-vue";
import {
    mapGetters,
    mapActions
} from "vuex";
export default {
    components: {
        ckeditor: CKEditor.component
    },
    data() {
        return {
            editor: {
                editor: ClassicEditor,
                editorConfig: {
                    height: "250px",
                    toolbar: {
                        items: [
                            "heading",
                            "|",
                            "bold",
                            "italic",
                            "|",
                            "bulletedList",
                            "numberedList",
                            "|",
                            "link",
                            "|",
                            "insertTable",
                            "|",
                            "undo",
                            "redo"
                        ]
                    },
                    table: {
                        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"]
                    },
                    language: "es"
                }
            },
            today: new Date().toISOString().substr(0, 10),
            focus: new Date().toISOString().substr(0, 10),
            type: "month",
            typeToLabel: {
                month: "Month",
                week: "Week",
                day: "Day",
                "4day": "4 days"
            },

            currentlyEditing: null,
            selectedEvent: {
                name: "",
                start: "",
                end: "",
                timeStart: "",
                timeStop: "",
                details: ""
            },
            selectedElement: null,
            selectedOpen: false,
            filteredEvents: [],
            drawer: false
        };
    },
    computed: {
        ...mapGetters(["dialog", "newEvent", "allEvents"])
    },
    async created() {
        await this.fetchEvents();
        this.filterEvents();
    },
    methods: {
        ...mapActions(["fetchEvents", "addEvent", "updateEvent", "deleteEvent"]),
        filterEvents() {
            this.filteredEvents = [...this.allEvents];
        },
        editEvent() {
            this.currentlyEditing = this.selectedEvent.id;
        },
        validation(event) {
            if (!event.name || !event.start || !event.end) {
                alert("please fill all required parameters for the event");
                return false;
            }
            if (
                event.timeStart &&
                event.timeStop &&
                new Date(event.start.substr(0, 10) + "T" + event.timeStart).getTime() >
                new Date(event.end.substr(0, 10) + "T" + event.timeStop).getTime()
            ) {
                alert("end time cannot be earlier than than start");
                return false;
            }
            if (event.timeStart && !event.timeStop) {
                event.timeStop = "24:00";
            }
            if (event.timeStop && !event.timeStart) {
                event.timeStart = "00:00";
            }
            return true;
        },
        addEventForm() {
            if (!this.validation(this.newEvent.value)) {
                return false;
            }
            this.addEvent();

            this.filterEvents();
        },
        updateEventForm() {
            if (!this.validation(this.selectedEvent)) {
                return false;
            }
            this.updateEvent(this.selectedEvent);
            this.selectedOpen = false;
            this.currentlyEditing = null;
            this.filterEvents();
        },
        deleteEventForm(event) {
            this.deleteEvent(event);
            this.selectedOpen = false;
            this.filterEvents();
        },
        getEventColor(ev) {
            return ev.color;
        },
        viewDay({
            date
        }) {
            this.focus = date;
            this.type = "day";
        },
        setToday() {
            this.focus = this.today;
            this.type = "day";
        },
        prev() {
            this.$refs.calendar.prev();
        },
        next() {
            this.$refs.calendar.next();
        },
        showEvent({
            nativeEvent,
            event
        }) {
            const open = () => {
                this.selectedEvent = event;

                this.selectedElement = nativeEvent.target;
                setTimeout(() => {
                    this.selectedOpen = true;
                }, 10);
            };

            if (this.selectedOpen) {
                this.selectedOpen = false;
                setTimeout(open, 10);
            } else {
                open();
            }

            nativeEvent.stopPropagation();
        }
    }
};
</script>
