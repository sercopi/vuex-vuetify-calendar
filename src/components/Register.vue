<template>
<v-container>
    REGISTER
    <v-row>
        <v-col>
            <v-form action>
                <div class="d-flex">
                    <v-icon color="primary" class="mr-2" large>mdi-email</v-icon>
                    <v-text-field type="email" v-model="email" label="Email"></v-text-field>
                </div>
                <div class="d-flex">
                    <v-icon color="primary" class="mr-2" large>mdi-lock-check</v-icon>
                    <v-text-field type="password" v-model="password" label="password"></v-text-field>
                </div>
            </v-form>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-btn @click="register" color="primary">register</v-btn>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import firebase from "firebase";
export default {
    data() {
        return {
            email: null,
            password: null
        };
    },

    methods: {
        register: function (event) {
            const router = this.$router;
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.email, this.password)
                .then(
                    user => {
                        alert(`acc created for ${user.user.email}`);
                        router.go({
                            path: router.path
                        });
                    },
                    error => alert(error.message)
                );
            event.preventDefault();
        }
    }
};
</script>
