<template>
<v-app>
    <v-app-bar app color="primary" dark>
        <div class="d-flex align-center">
            <v-btn color="primary" class="mr-4 d-md-none" @click.prevent="drawer = !drawer">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-spacer></v-spacer>

            <v-tabs app background-color="primary" class="d-none d-md-flex">
                <v-tab v-if="isLoggedIn" color="primary" to="/">Todos</v-tab>
                <v-spacer></v-spacer>

                <v-tab v-if="isLoggedIn" color="primary" to="/calendar">
                    CALENDAR
                    <v-icon>mdi-calendar</v-icon>
                </v-tab>
                <v-tab v-if="!isLoggedIn" color="primary" to="/login">LOGIN</v-tab>
                <v-tab v-if="!isLoggedIn" color="primary" to="/register">REGISTER</v-tab>
                <v-tab v-if="isLoggedIn" color="primary" @click.prevent="logOut">LOG OUT</v-tab>
            </v-tabs>
            <span v-if="isLoggedIn">{{currentUser}}</span>
        </div>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute left temporary app>
        <v-list>
            <v-list-item-group active-class="deep-purple--text text--accent-4">
                <v-list-item v-if="isLoggedIn" to="/">
                    <v-list-item-content>
                        <v-list-item-title>TODOS</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item v-if="isLoggedIn" to="/calendar">
                    <v-list-item-content>
                        <v-list-item-title>CALENDAR</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item v-if="!isLoggedIn" to="/login">
                    <v-list-item-content>
                        <v-list-item-title>LOGIN</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item v-if="!isLoggedIn" to="/register">
                    <v-list-item-content>
                        <v-list-item-title>REGISTER</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item v-if="isLoggedIn" @click="logOut">
                    <v-list-item-content>
                        <v-list-item-title>LOG OUT</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>

    <v-main>
        <v-container fluid>
            <router-view></router-view>
        </v-container>
    </v-main>
    <v-footer app color="primary" light class="d-none d-md-flex">
        <v-row justify="center">
            <v-col class="text-center">
                <v-btn icon hover href="https://github.com/bradtraversy/vuex_todo_manager">
                    <v-icon color="white" class="mr-2 icon-footer" x-large>mdi-github</v-icon>
                </v-btn>
            </v-col>
            <v-col class="text-center">
                <v-btn icon hover href="https://twitter.com/sergiiosercopi">
                    <v-icon color="white" class="mr-2 icon-footer" x-large>mdi-twitter</v-icon>
                </v-btn>
            </v-col>
            <v-col class="text-center">
                <v-btn icon hover href="https://www.instagram.com/sergiocorderopino/?hl=es">
                    <v-icon color="white" class="mr-2 icon-footer" x-large>mdi-instagram</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-footer>
</v-app>
</template>

<script>
import firebase from "firebase";

export default {
    name: "App",
    data: () => ({
        drawer: false,
        isLoggedIn: false,
        currentUser: false
    }),

    methods: {
        logOut() {
            const router = this.$router;
            firebase
                .auth()
                .signOut()
                .then(() => {
                    console.log(firebase.auth().currentUser);
                    router.push("/login");
                });
        }
    },
    created() {
        if (firebase.auth().currentUser) {
            this.isLoggedIn = true;
            this.currentUser = firebase.auth().currentUser.email;
        }
    }
};
</script>

<style scoped>
.icon-footer:hover {
    font-size: 20px;
}
</style>
