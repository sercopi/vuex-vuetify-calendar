<template>
<v-container>
    <v-dialog v-model="dialogAddTodo.value" max-width="500">
        <v-card>
            <v-container>
                <AddTodo @state-changed="filterTodos"></AddTodo>
            </v-container>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUpdateTodo.value" max-width="500">
        <v-card>
            <v-container>
                <UpdateTodo @state-changed="filterTodos"></UpdateTodo>
            </v-container>
        </v-card>
    </v-dialog>
    <v-subheader class="text-center">
        <h3 color="primary">TODOS</h3>
    </v-subheader>
    <v-row>
        <v-col class="text-center">
            <v-btn @click="filterCompleted" color="primary">{{showCompleted.value?'DONT show completed':'show completed'}}</v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-select label="pagination" v-model="itemsPerPage" :items="[2,5,10,20,'all']" @input="filterTodos(false)"></v-select>
        </v-col>
        <v-col>
            <v-select label="order By" v-model="orderParam" :items="['name ASC','name DESC','priority DESC','priority ASC']" @input="filterTodos(false)"></v-select>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-text-field @keyup="filterTodos(false)" type="text" v-model="name" label="search by name"></v-text-field>
        </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-row>
        <v-col class="text-center">
            <v-btn color="primary" fab @click="openDialogAddTodo">
                <v-icon center rounded x-large>mdi-plus-circle</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-pagination v-model="page" @input="filterTodos(true)" :length="pages"></v-pagination>
        </v-col>
    </v-row>
    <v-row>
        <v-col v-if="filteredTodos == null">
            <div class="text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
        </v-col>
        <v-col v-else-if="filteredTodos.length == 0">It seems you dont have any todo</v-col>
        <template v-else>
            <v-col v-for="(todo, index) in filteredTodos" :key="index" cols="12" sm="3" class="pa-3 d-flex flex-column">
                <v-card hover outlined :color="todo.completed?'green lighten-1':''" class="elevation-5 mx-auto flex d-flex flex-column" max-width="400">
                    <template>
                        <div @click="complete(todo)">
                            <v-card-title class="justify-center">{{ todo.name }}</v-card-title>

                            <v-card-text class="text-center">
                                <v-chip :color="types[todo.type]" class="ma-2">{{todo.type}}</v-chip>

                                <span v-if="todo.completed" class="text-center">
                                    <v-icon color="green darken-4" large>mdi-check-circle</v-icon>
                                </span>
                            </v-card-text>
                            <v-card-actions class="text-center">
                                <v-row>
                                    <v-col>
                                        <v-btn class="ma-2" :color="todo.completed?'green darken-4':'primary'" dark @click.stop="openDelete(todo)">
                                            Delete
                                            <v-icon dark right>mdi-delete</v-icon>
                                        </v-btn>

                                        <v-btn class="ma-2" :color="todo.completed?'green darken-4':'primary'" dark @click.stop="openUpdateDialog(todo)">
                                            EDIT
                                            <v-icon dark right>mdi-pencil</v-icon>
                                        </v-btn>

                                        <v-btn class="ma-2" :color="todo.completed?'green darken-4':'primary'" dark @click.stop="todoToEvent(todo)">
                                            to event
                                            <v-icon dark right>mdi-calendar</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>

                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </div>
                    </template>

                    <v-card-text hover outlined>
                        <v-expansion-panels outlined>
                            <v-expansion-panel outlined>
                                <v-expansion-panel-header>show details</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-card-text v-html="todo.details"></v-card-text>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card-text>
                </v-card>
            </v-col>
        </template>
    </v-row>
    <v-row>
        <v-col>
            <v-pagination v-model="page" @input="filterTodos(true)" :length="pages"></v-pagination>
        </v-col>
    </v-row>
    <v-dialog v-model="dialogDeleteTodo" max-width="290">
        <v-card>
            <v-card-title class="headline">Delete {{ this.newTodo.value.name }}?</v-card-title>
            <v-spacer></v-spacer>
            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" text @click="closeDelete">Disagree</v-btn>

                <v-btn color="green darken-1" text @click="deleteSelectedTodo">Agree</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import AddTodo from "@/components/AddTodo";
import UpdateTodo from "@/components/UpdateTodo";
import {
    mapGetters,
    mapActions
} from "vuex";
export default {
    name: "todos",
    components: {
        AddTodo,
        UpdateTodo
    },
    data() {
        return {
            dialogDeleteTodo: false,
            selectedTodo: {},
            itemsPerPage: "all",
            page: 1,
            name: "",
            filteredTodos: null,
            orderParam: "priority DESC",
            pages: 1,
            orderBys: {
                "name ASC": filteredTodos =>
                    filteredTodos.sort((todoA, todoB) => {
                        if (todoA.name > todoB.name) return +1;
                        return -1;
                    }),
                "name DESC": filteredTodos =>
                    filteredTodos.sort((todoA, todoB) => {
                        if (todoA.name > todoB.name) return -1;
                        return +1;
                    }),
                "priority ASC": filteredTodos => {
                    const typeToNumber = {
                        important: 2,
                        normal: 1,
                        "not important": 0
                    };
                    return filteredTodos.sort((todoA, todoB) => {
                        if (typeToNumber[todoB.type] > typeToNumber[todoA.type]) {
                            return -1;
                        }
                        if (typeToNumber[todoB.type] == typeToNumber[todoA.type]) {
                            return 0;
                        }
                        return +1;
                    });
                },
                "priority DESC": filteredTodos => {
                    const typeToNumber = {
                        important: 2,
                        normal: 1,
                        "not important": 1
                    };
                    return filteredTodos.sort((todoA, todoB) => {
                        if (typeToNumber[todoB.type] > typeToNumber[todoA.type]) {
                            return +1;
                        }
                        return -1;
                    });
                }
            }
        };
    },
    async created() {
        await this.fetchTodos();
        this.filterTodos(true);
    },

    computed: {
        ...mapGetters([
            "allTodos",
            "newEvent",
            "dialog",
            "dialogUpdateTodo",
            "dialogAddTodo",
            "newTodo",
            "showCompleted",
            "initialName",
            "types"
        ])
    },
    methods: {
        ...mapActions(["fetchTodos", "deleteTodo", "completeTodo"]),
        openDelete(todo) {
            this.dialogDeleteTodo = true;
            this.newTodo.value = {
                ...todo
            };
        },
        closeDelete() {
            this.dialogDeleteTodo = false;
            this.newTodo.value = {
                id: null,
                details: "",
                name: null,
                type: "normal"
            };
        },
        deleteSelectedTodo() {
            this.deleteTodo();
            this.dialogDeleteTodo = false;
            this.filterTodos();
        },
        openUpdateDialog(todo) {
            this.newTodo.value = {
                ...todo
            };
            this.initialName.value = this.newTodo.value.name;
            this.dialogUpdateTodo.value = true;
        },
        openDialogAddTodo() {
            this.newTodo.value = {
                id: null,
                details: "",
                name: null,
                type: "normal",
                completed: false
            };
            this.dialogAddTodo.value = true;
        },
        todoToEvent(todo) {
            this.dialog.value = true;
            this.newEvent.value.name = todo.name;
            this.newEvent.value.details = todo.details;
            this.$router.push({
                name: "calendar"
            });
        },
        complete(todo) {
            this.completeTodo(todo);
            this.filterTodos(true);
        },
        filterTodos(byPage = false) {
            if (!byPage) {
                this.page = 1;
            }
            this.filteredTodos = this.allTodos.filter(({
                name,
                completed
            }) => {
                const nameIncluded = name.includes(this.name);
                if (!this.showCompleted.value) {
                    return nameIncluded && !completed;
                }
                return nameIncluded;
            });

            this.filteredTodos = this.orderBys[this.orderParam](this.filteredTodos);
            let itemsPerPage = this.itemsPerPage;
            this.pages = Math.ceil(this.filteredTodos.length / itemsPerPage);

            if (this.itemsPerPage == "all") {
                itemsPerPage = this.filteredTodos.length;
                this.pages = 1;
            }
            this.filteredTodos = this.filteredTodos.slice(
                (this.page - 1) * itemsPerPage,
                this.page * itemsPerPage
            );
        },
        filterCompleted() {
            this.showCompleted.value = !this.showCompleted.value;
            this.filterTodos();
        }
    }
};
</script>

<style scoped></style>
