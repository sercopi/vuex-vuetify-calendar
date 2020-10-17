<template>
<v-form ref="form" v-model="valid.value">
    <v-text-field v-model="newTodo.value.name" :counter="30" :rules="[
        ...nameRules,
        v => !this.nameExists(v) || 'Name already exists!'
      ]" label="Name" required></v-text-field>Todo Details
    <ckeditor :editor="editor.editor" v-model="newTodo.value.details" :config="editor.editorConfig" label="details"></ckeditor>
    <!--<v-textarea outlined label="Details" :rules="detailRules" v-model="newTodo.value.details" :value="newTodo.value.details"></v-textarea>-->
    <v-select v-model="newTodo.value.type" :items="Object.keys(types)" label="Type" required></v-select>
</v-form>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-vue";
import {
    mapGetters
} from "vuex";
export default {
    components: {
        ckeditor: CKEditor.component
    },
    data: () => ({
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
        detailRules: [
            v => !!v || v !== "" || "Details are required",
            v => (v && v.length <= 100) || "Details must be less than 100 char"
        ],
        nameRules: [
            v => !!v || "Name is required",
            v => (v && v.length <= 30) || "Name must be less than 10 characters"
        ]
    }),
    computed: {
        ...mapGetters(["allTodos", "newTodo", "valid", "initialName", "types"])
    },
    methods: {
        validate() {
            this.$refs.form.validate();
        },
        reset() {
            this.$refs.form.reset();
        },
        nameExists(v) {
            return (
                v !== this.initialName.value &&
                this.allTodos.some(todo => todo.name == v)
            );
        }
    }
};
</script>

<style scoped></style>
