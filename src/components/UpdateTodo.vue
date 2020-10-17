<template>
<div>
    Update Form
    <TodoForm></TodoForm>
    <v-btn :disabled="!valid.value" color="success" class="mr-4" @click="sendForm">Update Todo</v-btn>
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
        ...mapGetters(["allTodos", "newTodo", "valid", "dialogUpdateTodo"])
    },
    mounted() {
        this.valid.value = true;
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
                this.updateTodo();
                this.dialogUpdateTodo.value = false;
                this.$emit("state-changed");
                /* this.$router.push("/"); */
            }
        },
        ...mapActions(["updateTodo"])
    }
};
</script>

<style scoped></style>
