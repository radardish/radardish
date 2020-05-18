import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyCLPdPZE3AXJWI4IyaxNUH1Vns_btyRmGY",
  authDomain: "radardish.github.io",
  databaseURL: "https://radardish-1e181.firebaseio.com",
  projectId: "radardish-1e181",
  storageBucket: "radardish-1e181.appspot.com",
  messagingSenderId: "1055621417968",
  appId: "1:1055621417968:web:bf2eb90bf497641b0bab35"
};

firebase.initializeApp(config);
export const provider = new firebase.auth.GithubAuthProvider();
export const auth = firebase.auth();
export default firebase;