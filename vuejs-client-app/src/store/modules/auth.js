import axios from "axios";
import store from "..";

const state = {
  user: null,
  accessToken: null,
  posts: null,
  values: null,
};

const getters = {
  isAuthenticated: (state) => !!state.accessToken,
  StatePosts: (state) => state.posts,
  StateUser: (state) => state.user,
  StateValues: (state) => state.values,
  StateAccessToken: (state) => state.accessToken,
};

const actions = {
  async Register({dispatch}, form) {
    await axios.post('register', form)
    let UserForm = new FormData()
    UserForm.append('username', form.username)
    UserForm.append('password', form.password)
    await dispatch('LogIn', UserForm)
  },

  async LogIn({commit}, user) {
    const response = await axios.post("/connect/token", user);
    //axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
    await commit("setUser", user.get("username"));
    await commit("setAccessToken", response.data.access_token);

    console.log("Response = " + response.data.access_token);
  },

  async CreatePost({ dispatch }, post) {
    await axios.post("post", post);
    return await dispatch("GetPosts");
  },

  async GetPosts({ commit }) {
    console.log("Access token: " + store.getters.StateAccessToken);
    //axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.getters.StateAccessToken;

    let response = await axios.get("https://localhost:44328/api/posts");
    commit("setPosts", response.data);
  },

  async LogOut({ commit }) {
    let user = null;
    commit("logout", user);
    commit("setAccessToken", null);
  },
};

const mutations = {
  setUser(state, username) {
    state.user = username;
  },

  setPosts(state, posts) {
    state.posts = posts;
  },

  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
  },

  logout(state, user) {
    state.user = user;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
