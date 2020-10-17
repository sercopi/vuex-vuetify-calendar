<template>
<div>
    Add Form
    <TodoForm></TodoForm>
    <v-btn :disabled="!valid.value" color="success" class="mr-4" @click="sendForm">Add Todo</v-btn>
</div>
</template>

<script>
import TodoForm from "@/components/TodoForm";
import {
    mapActions,
    mapGetters
} from "vuex";
export default {
    components: {
        TodoForm
    },
    data: () => ({}),
    computed: {
        ...mapGetters([
            "allTodos",
            "newTodo",
            "valid",
            "initialName",
            "dialogAddTodo"
        ])
    },
    mounted() {
        this.initialName.value = "";
        this.valid.value = false;
    },
    methods: {
        validate() {
            this.$refs.form.validate();
        },
        reset() {
            this.$refs.form.reset();
        },
        sendForm() {
            if (this.valid.value) {
                this.addTodo();
                this.dialogAddTodo.value = false;
                this.$emit("state-changed");
            }
        },

        ...mapActions(["addTodo"])
    }
};
</script>

<style scoped></style>
